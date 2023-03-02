import {
  SpriteEntity,
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
import monImg from "./Assets/monsprite.png";
import spirteSheet from "./Assets/sprites.png";
import "./style.css";
import { ProjectileTypeSprite, Vector } from "./Objects/SpriteTypes";

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

const monsterPic = new Image();
monsterPic.src = monImg;
const sheet = new Image();
sheet.src = spirteSheet;

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
    damage: 25,
  },
  attack: {
    width: 32,
    height: 32,
    secondary: {
      width: 16,
      height: 16,
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
const monster1 = SpriteEntity({
  type: "entity",
  position: { x: 468, y: 450 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster2 = SpriteEntity({
  type: "entity",
  position: { x: 368, y: 650 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster3 = SpriteEntity({
  type: "entity",
  position: { x: 368, y: 550 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster4 = SpriteEntity({
  type: "entity",
  position: { x: 398, y: 550 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster5 = SpriteEntity({
  type: "entity",
  position: { x: 398, y: 560 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster6 = SpriteEntity({
  type: "entity",
  position: { x: 398, y: 530 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const mapTiles = BuildMapSprite(
  {
    ctx,
    mapString: Map1,
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

let monsters: EntityTypeSprite[] = [
  monster1,
  monster2,
  monster3,
  monster4,
  monster5,
  monster6,
];
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

    const newProjectile = SpriteProjectile(
      ctx,
      { width: 16, height: 16 },
      zoomOn
    );
    newProjectile.setValues(getScreenCenter(), getLastClickPosition(), {
      ...offset,
    });
    projectiles.push(newProjectile);
  }
  if (renderingProjectile) {
    const animationOngoing = projectiles.filter((projectile) =>
      projectile.draw(offset)
    );
    projectiles = animationOngoing;
    if (!projectiles.length) renderingProjectile = false;
  }
  if (Control.isKeyPressed("attack")) {
    if (monsters.length) {
      monsters.forEach((monster, i) => {
        const finishingBlow = player.attack(
          getScreenCenter(),
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
    player.attack(getScreenCenter(), collisionState.checkForCollisionCharacter);
  }
  if (deleteEntitysIndex.length) {
    /* we use a temporary array to store a collection of monster's which are still going
    to be rendered, but we assign it after the monster have been removed from their original
    location, otherwise monster's which should be unaffected get deleted by accident if 
    deleteing multiple monsters on the same game tick.
    */
    const tempMon: (EntityTypeSprite | null)[] = [...monsters];
    deleteEntitysIndex.forEach((n) => {
      tempMon[n] = null;
    });
    setTimeout(() => {
      monsters = tempMon.filter((m) => m !== null) as EntityTypeSprite[];
    }, 250);
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
