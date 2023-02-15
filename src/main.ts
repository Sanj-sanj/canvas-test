import { Keybinds, MovementKey } from "./KeybindingsTypes";
import Sprite from "./Objects/Sprite";
import Collisions from "./Collisions";
import "./style.css";

import img from "./Assets/mage.png";
import spirteSheet from "./Assets/sprites.png";
import BuildMapSprite from "./BuildMapSprites";

const root = document.querySelector<HTMLDivElement>("#app");
const canvas = document.createElement("canvas");
canvas.width = 864;
canvas.height = 576;

document.addEventListener("keypress", handleKeyActions);
document.addEventListener("keyup", stopMovement);

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
ctx.fillStyle = "green";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

const testMap = `
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~==================-========~
~=[[*[W___^^^[[[[**********=~
~=***[WVXXXW^****[******[[[=~
~=****[WWWWW^******^^^^^^**=~
~=*****^***^^****^*^****^**=~
~=*****^***^^^^^^^^^****^**=~
~={{***^^^^^*{*{{**^^***^^*=~
~={{***{{{{{{{{{{**^^***^^*=~
~{{{*{{{{{{{*********^^^^^^=~
~{{{{{[[{****WWWWWW***{{{{{=~
~=[[{[******W______**^{{{{{=~
~=**^*******WXXXXXXXW^^^^^^=~
~=**********WXXXXXXXW******=~
~=**********WXVXXXXXW******=~
~===========================~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
`;

const tMap2 = `
=***WWWWW*
****WXXXW*
****^^^^^*
***^*====*
**********
*******{{*
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
    // const tempPCoords = {
    //   x: currPlayerPostion.x - offset.x,
    //   y: currPlayerPostion.y - offset.y,
    // };
    // console.log(tempPCoords);
    player.log(offset);
    collidables.log();
    keybinds.terminate.pressed = !keybinds.terminate.pressed;
    animate(); //force the loop to start again if debug has been toggled off -> on
  }
}

function setOffset(pos: "x" | "y", operand: "+" | "-", speed = 3) {
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
    mapString: testMap,
    offset,
    spriteSheet: sheet,
    tileSize: 32,
    scaling: 3,
  },
  collidables.appendCollidable
);

function keypressHandler() {
  let lastPressedMovementKey: "w" | "a" | "s" | "d";
  let lastOperand: "+" | "-";

  function updateKeypress(coords: { x: number; y: number }) {
    if (collidables.checkForCollision(coords)) {
      setOffset(
        lastPressedMovementKey === "w" || lastPressedMovementKey === "s"
          ? "y"
          : "x",
        lastOperand === "+" ? "-" : "+",
        6
      );
      keybinds[lastPressedMovementKey].pressed = false;
    }
    if (keybinds.w.pressed) {
      setOffset("y", "+");
      lastPressedMovementKey = "w";
      lastOperand = "+";
    }
    if (keybinds.s.pressed) {
      setOffset("y", "-");
      lastPressedMovementKey = "s";
      lastOperand = "-";
    }
    if (keybinds.a.pressed) {
      setOffset("x", "+");
      lastPressedMovementKey = "a";
      lastOperand = "+";
    }
    if (keybinds.d.pressed) {
      setOffset("x", "-");
      lastPressedMovementKey = "d";
      lastOperand = "-";
    }
  }
  return { updateKeypress };
}
const keypress = keypressHandler();

function animate() {
  if (keybinds.terminate.pressed === true) return;
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

animate();
root?.append(canvas);
