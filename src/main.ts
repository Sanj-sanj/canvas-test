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

import img from "./Assets/mage.png";
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

const playerPic = new Image();
playerPic.src = img;

const monsterPic = new Image();
monsterPic.src = monImg;
const sheet = new Image();
sheet.src = spirteSheet;

const collidables = Collisions();
collidables;
let zoomOn = false;

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
  source: {
    frames: { min: 0, max: 1 },
    height: 32,
    width: 32,
    img: playerPic,
  },
});
const monster = SpriteEntity({
  type: "entity",
  position: { x: 246, y: 150 },
  ctx: ctx,
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
    mapString: Map2,
    offset,
    spriteSheet: sheet,
    tileSize: 32,
  },
  collidables.appendCollidable
);

const Control = KeybindHandler({
  animate,
  collidables,
  updateOffset,
});

let scale = 1;
const ids: number[] = [];

function toggleZoom() {
  if (zoomOn && scale < 2 && ids.length < 5) {
    ids.push(
      setTimeout(() => {
        updateOffset("y", "-", 28.8);
        updateOffset("x", "-", 42);
        scale += 0.2;
      })
    );
  } else if (!zoomOn && scale > 1 && ids.length >= 1) {
    ids.forEach(() => {
      setTimeout(() => {
        updateOffset("y", "+", 28.8);
        updateOffset("x", "+", 42);
        scale -= 0.2;
      });
      clearTimeout(ids.shift());
    });
  }
}

const moveables: MapTypeSprite[] | EntityTypeSprite[] = [...mapTiles, monster];

function animate() {
  ctx.scale(scale, scale);
  if (Control.isKeyPressed("terminate")) return;
  if (Control.isKeyPressed("zoom")) {
    zoomOn = true;
    toggleZoom();
  } else {
    zoomOn = false;
    toggleZoom();
  }

  window.requestAnimationFrame(animate);
  // ctx.fillStyle = "black";
  // ctx?.fillRect(0, 0, canvas.width, canvas.height);

  moveables.forEach((moveable) => {
    moveable.updateOffset(offset);
    moveable.draw();
  });

  player.draw(getScreenCenter());

  const tempPCoords = {
    x: getScreenCenter().x - offset.x,
    y: getScreenCenter().y - offset.y,
  };

  Control.keypressEventEmitter(tempPCoords, 6);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

Control.initControls();
animate();
root?.append(canvas);
