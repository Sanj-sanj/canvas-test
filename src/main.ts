import { Keybinds, MovementKey } from "./KeybindingsTypes";
import Sprite from "./Objects/Sprite";
import "./style.css";
import img from "./Assets/mageSprite(1).png";
import img2 from "./Assets/map.png";

const root = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
canvas.width = 796;
canvas.height = 476;

document.addEventListener("keypress", handleSpriteMovement);
document.addEventListener("keyup", stopMovement);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.fillStyle = "green";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

const keybinds: Keybinds = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
  terminate: { pressed: false },
};

const playerPic = new Image();
playerPic.src = img;
const mapPic = new Image();
mapPic.src = img2;

let mapX = -530,
  mapY = -90;

const player = new Sprite({
  name: "player",
  position: { x: 225, y: 145 },
  ctx: ctx,
  bindings: keybinds,
  spritePNG: playerPic,
});

//need a better more generic sprite class
const map = new Sprite({
  name: "map",
  ctx: ctx,
  position: { x: 150, y: 150 },
  spritePNG: mapPic,
});

function stopMovement(e: KeyboardEvent) {
  //called on keyup to stop movement
  const mvKey = e.key as MovementKey;
  if (Object.keys(keybinds).includes(e.key)) {
    keybinds[mvKey].pressed = false;
  }
}

function handleSpriteMovement(e: KeyboardEvent) {
  const mvKey = e.key as MovementKey;
  if (Object.keys(keybinds).includes(e.key)) {
    keybinds[mvKey].pressed = true;
  }
  if (e.key === "]") {
    console.log("debug");
    console.log(player);
    keybinds.terminate.pressed = !keybinds.terminate.pressed;
    animate(); //force the loop to start again if debug has been toggled off -> on
  }
}

function animate() {
  if (keybinds.terminate.pressed === true) return;
  window.requestAnimationFrame(animate);
  ctx.scale(3, 3);
  ctx.drawImage(mapPic, mapX, mapY);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  player.draw();
  if (keybinds.w.pressed) mapY += 2;
  if (keybinds.s.pressed) mapY -= 2;
  if (keybinds.a.pressed) mapX += 2;
  if (keybinds.d.pressed) mapX -= 2;
}

animate();
root?.append(canvas);
