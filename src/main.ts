import Sprite from "./Objects/Sprite";
import Collisions from "./Collisions";
import BuildMapSprite from "./BuildMapSprites";
import KeybindHandler from "./KeybindHandler";
import { Map1, Map2 } from "./utils/MapStrings";

import img from "./Assets/mage.png";
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

const sheet = new Image();
sheet.src = spirteSheet;

// our plyer's center position relative to the screen size will be by the formula:
// [canvas.width | canvas.height] / 2 { / scaling } { - SPRITE SIZE / 2 for x})
const currPlayerPostion = {
  x: Math.floor(canvas.width / 2 - 16),
  y: Math.floor(canvas.height / 2),
};
const offset = { x: 48, y: 16 };

const player = Sprite({
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
const collidables = Collisions();

function updateOffset(pos: "x" | "y", operand: "+" | "-", speed = 6) {
  if (operand === "+") {
    offset[pos] += speed;
  }
  if (operand === "-") {
    offset[pos] -= speed;
  }
}

const mapTiles = BuildMapSprite(
  {
    ctx,
    mapString: Map1,
    offset,
    spriteSheet: sheet,
    tileSize: 32,
  },
  collidables.appendCollidable
);

const Control = KeybindHandler({
  animate,
  collidables,
  player,
  updateOffset,
  offset,
});

function animate() {
  if (Control.isKeyPressed("terminate")) return;
  window.requestAnimationFrame(animate);
  // ctx.scale(3, 3);
  mapTiles.forEach((tile) => tile.draw(offset));
  player.draw(offset);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const tempPCoords = {
    x: currPlayerPostion.x - offset.x,
    y: currPlayerPostion.y - offset.y,
  };
  Control.updateKeypress(tempPCoords, 6);
}

Control.initControls();
animate();
root?.append(canvas);
