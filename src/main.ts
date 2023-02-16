import Sprite from "./Objects/Sprite";
import Collisions from "./Collisions";
import "./style.css";

import img from "./Assets/mage.png";
import spirteSheet from "./Assets/sprites.png";
import BuildMapSprite from "./BuildMapSprites";

import { Map1 } from "./utils/MapStrings";
import KeybindState from "./KeybindState";

const root = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
canvas.width = 864;
canvas.height = 576;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.fillStyle = "green";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

const playerPic = new Image();
playerPic.src = img;

const sheet = new Image();
sheet.src = spirteSheet;

// our plyer's center position relative to the screen size will be by the formula:
// [canvas.width | canvas.height] / 2 - ( [PLAYER SPRITE WIDTH | HEIGHT] / 2 )
const currPlayerPostion = {
  x: Math.floor(canvas.width / 2 / 3 - 16),
  y: Math.floor(canvas.height / 2 / 3),
};
const offset = { x: 0, y: 0 };

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

function updateOffset(pos: "x" | "y", operand: "+" | "-", speed = 3) {
  if (operand === "+") {
    offset[pos] += speed;
  }
  if (operand === "-") {
    offset[pos] -= speed;
  }
}

const Map2dArray = BuildMapSprite(
  {
    ctx,
    mapString: Map1,
    offset,
    spriteSheet: sheet,
    tileSize: 32,
    scaling: 3,
  },
  collidables.appendCollidable
);

const keypress = KeybindState({
  animate,
  collidables,
  player,
  updateOffset,
  offset,
});

function animate() {
  if (keypress.isKeyPressed("terminate")) return;

  window.requestAnimationFrame(animate);
  ctx.scale(3, 3);
  Map2dArray.forEach((row) => row.forEach((t) => t.draw(offset)));
  player.draw(offset);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const tempPCoords = {
    x: currPlayerPostion.x - offset.x,
    y: currPlayerPostion.y - offset.y,
  };
  keypress.updateKeypress(tempPCoords);
}

document.addEventListener("keypress", keypress.handleKeyDown);
document.addEventListener("keyup", keypress.handleKeyUp);
animate();
root?.append(canvas);
