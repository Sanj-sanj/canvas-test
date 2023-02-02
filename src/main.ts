import { Keybinds, MovementKey } from "./KeybindingsTypes";
import Sprite from "./Objects/Sprite";
import "./style.css";

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

const player = new Sprite({
  name: "player",
  position: { x: 75, y: 75 },
  ctx: ctx,
  bindings: keybinds,
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
  player.draw();
}
animate();

root?.append(canvas);
