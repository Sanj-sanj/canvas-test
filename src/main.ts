import { Keybinds, MovementKey } from "./KeybindingsTypes";
import Sprite from "./Objects/Sprite";
import "./style.css";

import img from "./Assets/mage.png";
import spirteSheet from "./Assets/sprites.png";
import BuildMapSprite from "./BuildMapSprites";

const root = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
canvas.width = 864;
canvas.height = 512;

document.addEventListener("keypress", handleKeyActions);
document.addEventListener("keyup", stopMovement);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.fillStyle = "green";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

const testMap = `
==================-========
=[[*[W___^^^[[[[**********=
=***[WVXXXW^****[******[[[=
=****[WWWWW^******^^^^^^**=
=*****^***^^****^*^****^**=
=*****^***^^^^^^^^^****^**=
={{***^^^^^*{*{{**^^***^^*=
={{***^^^^^{{{{{**^^***^^*=
=*{*{{{{{{{{**************=
=**{**[{****WWWWWW***{{{{*=
=**{*******W______**^{{{{*=
=**^*******WXXXXXXXW^^^^^*=
=**********WXXXXXXXW******=
=**********WXVXXXXXW******=
===========================
`;
const keybinds: Keybinds = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
  terminate: { pressed: false },
};

const playerPic = new Image();
playerPic.src = img;

const sheet = new Image();
sheet.src = spirteSheet;

// our plyer's center position relative to the screen size will be by the formula:
// [canvas.width | canvas.height] / 2 - ( [PLAYER SPRITE WIDTH | HEIGHT] / 2 )
const currPlayerPostion = {
  x: Math.floor(canvas.width / 2 / 3 - 16),
  y: Math.floor(canvas.height / 2 / 3 - 7),
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
    console.log(currPlayerPostion);
    console.log(player.log(offset));
    console.log(Map2dArray[2][4].log(offset));
    keybinds.terminate.pressed = !keybinds.terminate.pressed;
    animate(); //force the loop to start again if debug has been toggled off -> on
  }
}

function setOffset(pos: "x" | "y", operand: "+" | "-") {
  if (operand === "+") {
    offset[pos] += 2;
  }
  if (operand === "-") {
    offset[pos] -= 2;
  }
}

const Map2dArray = BuildMapSprite({
  ctx,
  mapString: testMap,
  offset,
  spriteSheet: sheet,
  tileSize: 32,
});
function animate() {
  if (keybinds.terminate.pressed === true) return;
  window.requestAnimationFrame(animate);
  Map2dArray.forEach((row) => row.forEach((t) => t.draw(offset)));
  player.draw(offset);
  // move this keybind stuff else where the movement should be bdased on what type of map the character is in, (outside move map, inside move char)
  if (keybinds.w.pressed) setOffset("y", "+");
  if (keybinds.s.pressed) setOffset("y", "-");
  if (keybinds.a.pressed) setOffset("x", "+");
  if (keybinds.d.pressed) setOffset("x", "-");
}

animate();
root?.append(canvas);
