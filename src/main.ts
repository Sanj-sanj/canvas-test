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

const movements = {
  w: { pressed: false },
  s: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
  terminate: { pressed: false },
};

class Sprite {
  name: string;
  position: { x: number; y: number };
  width = 48;
  height = 48;
  speed = 6;
  constructor({
    name,
    position,
    speed = 6,
  }: {
    name: string;
    position: { x: number; y: number };
    speed?: number;
  }) {
    this.name = name;
    this.position = position;
    this.speed = speed;
  }
  draw() {
    console.log(this.position.y);
    // this should clear the previous square before rendering the next one
    ctx.fillStyle = "green";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (movements.w.pressed) this.position.y -= this.speed;
    if (movements.s.pressed) this.position.y += this.speed;
    if (movements.a.pressed) this.position.x -= this.speed;
    if (movements.d.pressed) this.position.x += this.speed;
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Sprite({ name: "player", position: { x: 75, y: 75 } });

function stopMovement(e: KeyboardEvent) {
  if (e.key === "w") movements.w.pressed = false;
  if (e.key === "s") movements.s.pressed = false;
  if (e.key === "a") movements.a.pressed = false;
  if (e.key === "d") movements.d.pressed = false;
}

function handleSpriteMovement(e: KeyboardEvent) {
  // const offset = 6;
  console.log(e);
  if (e.key === "w") {
    movements.w.pressed = true;
  }
  if (e.key === "s") {
    movements.s.pressed = true;
  }

  if (e.key === "a") {
    movements.a.pressed = true;
  }

  if (e.key === "d") {
    movements.d.pressed = true;
  }

  if (e.key === "]") {
    console.log("debug");
    console.log(player);
    movements.terminate.pressed = !movements.terminate.pressed;
    animate(); //force the loop to start again if debug has been toggled off -> on
  }
}

function animate() {
  if (movements.terminate.pressed === true) return;
  window.requestAnimationFrame(animate);
  player.draw();
}
animate();

root?.append(canvas);
