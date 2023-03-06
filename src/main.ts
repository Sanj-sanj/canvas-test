import {
  // SpriteEntity,
  SpriteCharacter,
  MapTypeSprite,
  EntityTypeSprite,
  SpriteProjectile,
} from "./Objects/Sprite";
import Collisions from "./Collisions";
import BuildMapSprite from "./BuildMapSprites";
import KeybindHandler from "./KeybindHandler";
import { Map1, Map2 } from "./utils/MapStrings";

import mageRight from "./Assets/mageRight.png";
import mageLeft from "./Assets/mageLeft.png";
// import monImg from "./Assets/monsprite.png";
import spriteSheet from "./Assets/sprites.png";
import "./style.css";
import { ProjectileTypeSprite, Vector } from "./Objects/SpriteTypes";
import { testMons } from "./Objects/GameEntitys";

const root = document.querySelector<HTMLDivElement>("#app");
// const canvas = document.createElement("canvas");
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = 864;
canvas.height = 576;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.fillStyle = "black";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

const playerPicR = new Image();
playerPicR.src = mageRight;
const playerPicL = new Image();
playerPicL.src = mageLeft;

const sheet = new Image();
sheet.src = spriteSheet;

const collisionState = Collisions();
let zoomOn = false;
let scale = 1;

function toggleZoom(zoomState: boolean) {
  if (zoomState) {
    updateOffset("y", "-", 28.8 * 5);
    updateOffset("x", "-", 210);
    scale = 2;
    zoomOn = zoomState;
  } else if (!zoomState) {
    updateOffset("y", "+", 28.8 * 5);
    updateOffset("x", "+", 42 * 5);
    scale = 1;
    zoomOn = zoomState;
  }
}

// our plyer's center position relative to the screen size will be by the formula:
// [canvas.width | canvas.height] / 2 { / scaling } { - SPRITE SIZE / 2 for x})
const currPlayerPostion = {
  x: Math.floor(canvas.width / 2 - 16),
  y: Math.floor(canvas.height / 2),
};
const offset = { x: 48, y: 0 };
const lastClickPosition = { x: 0, y: 0 };

function getLastClickPosition() {
  if (zoomOn) {
    return {
      x: lastClickPosition.x / 2,
      y: lastClickPosition.y / 2,
    };
  }

  return lastClickPosition;
}

function updateLastClickPosition(newPos: Vector) {
  lastClickPosition.x = newPos.x;
  lastClickPosition.y = newPos.y;
}

function getScreenCenter() {
  if (zoomOn) {
    return {
      x: Math.floor(canvas.width / 2 / 2 - 8),
      y: Math.floor(canvas.height / 2 / 2),
    };
  }
  return {
    x: Math.floor(canvas.width / 2 - 16),
    y: Math.floor(canvas.height / 2),
  };
}

function updateOffset(pos: "x" | "y", operand: "+" | "-", speed = 6) {
  if (operand === "+") {
    offset[pos] += speed;
  }
  if (operand === "-") {
    offset[pos] -= speed;
  }
}

const player = SpriteCharacter({
  type: "character",
  position: currPlayerPostion,
  ctx: ctx,
  stats: {
    health: 100,
    strength: 25,
  },
  attack: {
    primary: {
      width: 32,
      height: 32,
      damage: 25,
    },
    secondary: {
      width: 16,
      height: 16,
      damage: 10,
    },
  },
  source: {
    frames: { min: 0, max: 1 },
    height: 32,
    width: 32,
    img: {
      left: playerPicL,
      right: playerPicR,
    },
  },
});
const mapTiles = BuildMapSprite(
  {
    ctx,
    mapString: Map2,
    offset,
    spriteSheet: sheet,
    tileSize: 32,
  },
  collisionState.appendCollidable
);

const Control = KeybindHandler({
  animate,
  collidables: collisionState,
  keypressActions: {
    updateOffset,
    toggleZoom,
    updateLastClickPosition,
  },
  player,
});

let monsters: EntityTypeSprite[] = testMons;
let projectiles: ProjectileTypeSprite[] = [];
const moveables: MapTypeSprite[] = [...mapTiles];
let removedSprites: EntityTypeSprite[] = [];
let renderingProjectile = false;
function animate() {
  if (Control.isKeyPressed("pause")) return;
  ctx.scale(scale, scale);
  window.requestAnimationFrame(animate);
  // this canvas edit fills everything in black before redrawing other sprites
  // needed when zooming in and out, otherwise artefacts of previous renders exist outside of drawn sprite boundaries.
  ctx.fillStyle = "black";
  ctx?.fillRect(0, 0, canvas.width, canvas.height);

  moveables.forEach((moveable) => {
    moveable.updateOffset(offset);
    moveable.draw();
  });
  monsters.forEach((mon) => {
    mon.updateOffset(offset);
    mon.draw();
  });
  player.draw(getScreenCenter());

  const deleteEntitysIndex: number[] = [];

  if (Control.isKeyPressed("secondaryAttack")) {
    renderingProjectile = true;
    const newProjectile = SpriteProjectile(ctx, { width: 16, height: 16 });
    newProjectile.setValues(getScreenCenter(), getLastClickPosition(), {
      ...offset,
    });
    projectiles.push(newProjectile);
  }
  if (renderingProjectile) {
    const animationOngoing = projectiles.filter((projectile) => {
      monsters.forEach((monster, i) => {
        const { finishingBlow, isHit } = player.secondaryAttack(
          collisionState.checkForCollisionCharacter,
          monster,
          projectile.getRect()
        );
        if (isHit) {
          projectile.endAnimation();
          if (finishingBlow) {
            removedSprites = [...removedSprites, monster];
            deleteEntitysIndex.push(i);
            monster.killThisSprite();
          }
        }
      });
      return projectile.draw(offset);
    });
    projectiles = animationOngoing;
    if (!projectiles.length) renderingProjectile = false;
  }

  if (Control.isKeyPressed("attack")) {
    if (monsters.length) {
      monsters.forEach((monster, i) => {
        const finishingBlow = player.attack(
          "primary",
          collisionState.checkForCollisionCharacter,
          monster
        );

        if (finishingBlow) {
          removedSprites = [...removedSprites, monster];
          deleteEntitysIndex.push(i);
          monster.killThisSprite();
          // to be fleshed outt
        }
      });
    }
    player.attack("primary", collisionState.checkForCollisionCharacter);
  }
  if (deleteEntitysIndex.length) {
    /* temp array shallow copy
    delete monster's whichby index to unaffect unrelated
    monsters on the same game tick.
    */
    const tempMon: (EntityTypeSprite | null)[] = [...monsters];
    deleteEntitysIndex.forEach((n) => {
      tempMon[n] = null;
    });
    setTimeout(() => {
      monsters = tempMon.filter((m) => m !== null) as EntityTypeSprite[];
    }, 300);
  }
  const tempPCoords = {
    x: getScreenCenter().x - offset.x,
    y: getScreenCenter().y - offset.y,
  };

  Control.keypressEventEmitter(tempPCoords, 4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

Control.initControls();
animate();
root?.append(canvas);
