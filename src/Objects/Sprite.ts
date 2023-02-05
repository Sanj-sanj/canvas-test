import { Keybinds } from "../KeybindingsTypes";

class Sprite {
  name;
  position;
  width = 612;
  height = 204;
  speed = 6;
  ctx;
  keybinds;
  src;
  image;
  constructor({
    name,
    position,
    speed = 6,
    ctx,
    bindings,
    spritePNG,
  }: {
    name: string;
    position: { x: number; y: number };
    speed?: number;
    ctx: CanvasRenderingContext2D;
    bindings?: Keybinds;
    spritePNG: HTMLImageElement;
  }) {
    this.name = name;
    this.position = position;
    this.speed = speed;
    this.ctx = ctx;
    this.keybinds = bindings;
    this.src = spritePNG;
    this.image = new Image();
  }
  draw() {
    this.image = this.src;
    console.log(this.position.y);
    // this should clear the previous square before rendering the next one
    this.ctx.clearRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    console.log(this.image);
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.width / 3,
      this.height,
      this.position.x,
      this.position.y,
      this.width / 2,
      this.height
    );
    // this.ctx.fillStyle = "green";s
    // this.ctx.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );

    if (this.keybinds) {
      if (this.keybinds.w.pressed) this.position.y -= this.speed;
      if (this.keybinds.s.pressed) this.ctx.translate(0, 5);
      if (this.keybinds.a.pressed) this.position.x -= this.speed;
      if (this.keybinds.d.pressed) this.position.x += this.speed;
    }
    // this.ctx.fillStyle = "red";
    // this.ctx.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );
  }
}
export default Sprite;
