import {
  SpriteEntity,
  SpriteCharacter,
  MapTypeSprite,
  EntityTypeSprite,
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

const root = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
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
    damage: 10,
  },
  attack: {
    width: 32,
    height: 32,
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
const monster = SpriteEntity({
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
    startX: 0,
    startY: 0,
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
  },
  player,
});

const moveables: (MapTypeSprite | EntityTypeSprite)[] = [...mapTiles, monster];

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

  player.draw(getScreenCenter());

  if (Control.isKeyPressed("attack")) {
    player.attack(
      getScreenCenter(),
      collisionState.checkForCollisionCharacter,
      monster
    );
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
