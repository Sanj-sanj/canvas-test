import { Keybinds, MovementKey } from "./KeybindingsTypes";
import Sprite from "./Objects/Sprite";
import "./style.css";
import img from "./Assets/mageSprite(1).png";
import img2 from "./Assets/map.png";
import img3 from "./Assets/waterTile.jpg";
const root = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
canvas.width = 796;
canvas.height = 476;

document.addEventListener("keypress", handleKeyActions);
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

const offset = { x: 0, y: 0 };

const playerPic = new Image();
playerPic.src = img;
const mapPic = new Image();
mapPic.src = img2;
const rockPic = new Image();
rockPic.src = img3;

const currPlayerPostion = { x: 225, y: 145 };
const currMapPosition = { x: -530, y: -90 };
const currRockPosition = { x: 245, y: 150 };

const player = new Sprite({
  type: "character",
  position: currPlayerPostion,
  ctx: ctx,
  bindings: keybinds,
  spritePNG: playerPic,
  frames: 3,
  size: { height: 204, width: 612 },
});

//Sprite class distinguishes the type of 'sprite' to show, future, there will be multiple subtypes ex map: "inside building" | "outside"
const map = new Sprite({
  type: "map",
  ctx: ctx,
  position: currMapPosition,
  spritePNG: mapPic,
  size: { height: 612, width: 204 }, //this should be an optional prop in this case
});
const rock = new Sprite({
  type: "block",
  ctx: ctx,
  position: currRockPosition,
  spritePNG: rockPic,
  size: { height: 16, width: 16 },
});

function stopMovement(e: KeyboardEvent) {
  //called on keyup to stop movement
  const mvKey = e.key as MovementKey;
  if (Object.keys(keybinds).includes(e.key)) {
    keybinds[mvKey].pressed = false;
  }
}

function handleKeyActions(e: KeyboardEvent) {
  const mvKey = e.key as MovementKey;
  if (Object.keys(keybinds).includes(e.key)) {
    keybinds[mvKey].pressed = true;
  }
  if (e.key === "]") {
    console.log("debug");
    console.log(player);
    console.log(rock);
    keybinds.terminate.pressed = !keybinds.terminate.pressed;
    animate(); //force the loop to start again if debug has been toggled off -> on
  }
}

function setOffset(pos: "x" | "y", operand: "+" | "-") {
  if (operand === "+") {
    currMapPosition[pos] += 2;
    currRockPosition[pos] += 2;
  }
  if (operand === "-") {
    currMapPosition[pos] -= 2;
    currRockPosition[pos] -= 2;
  }
}

function animate() {
  if (keybinds.terminate.pressed === true) return;
  window.requestAnimationFrame(animate);
  map.draw();
  rock.draw();
  player.draw();
  // move this keybind stuff else where the movement should be based on what type of map the character is in, (outside move map, inside move char)
  if (keybinds.w.pressed) setOffset("y", "+");
  if (keybinds.s.pressed) setOffset("y", "-");
  if (keybinds.a.pressed) setOffset("x", "+");
  if (keybinds.d.pressed) setOffset("x", "-");
}

animate();
root?.append(canvas);
