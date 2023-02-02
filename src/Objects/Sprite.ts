import { Keybinds } from "../KeybindingsTypes";

class Sprite {
  name;
  position;
  width = 48;
  height = 48;
  speed = 6;
  ctx;
  keybinds;
  constructor({
    name,
    position,
    speed = 6,
    ctx,
    bindings,
  }: {
    name: string;
    position: { x: number; y: number };
    speed?: number;
    ctx: CanvasRenderingContext2D;
    bindings?: Keybinds;
  }) {
    this.name = name;
    this.position = position;
    this.speed = speed;
    this.ctx = ctx;
    this.keybinds = bindings;
  }
  draw() {
    console.log(this.position.y);
    // this should clear the previous square before rendering the next one
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    if (this.keybinds) {
      if (this.keybinds.w.pressed) this.position.y -= this.speed;
      if (this.keybinds.s.pressed) this.position.y += this.speed;
      if (this.keybinds.a.pressed) this.position.x -= this.speed;
      if (this.keybinds.d.pressed) this.position.x += this.speed;
    }
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
export default Sprite;
