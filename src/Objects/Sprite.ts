import { Keybinds } from "../KeybindingsTypes";

class Sprite {
  type;
  position;
  width = 612;
  height = 204;
  frames = 1;
  ctx;
  keybinds;
  src;
  image;
  constructor({
    type,
    position,
    frames,
    ctx,
    bindings,
    spritePNG,
  }: {
    type: "map" | "character" | "block";
    position: { x: number; y: number };
    frames?: number;
    ctx: CanvasRenderingContext2D;
    bindings?: Keybinds;
    spritePNG: HTMLImageElement;
  }) {
    this.type = type;
    this.position = position;
    this.frames = frames || 1;
    this.ctx = ctx;
    this.keybinds = bindings;
    this.src = spritePNG;
    this.image = new Image();
  }
  draw() {
    this.image = this.src;
    if (this.type === "character") {
      this.ctx.drawImage(
        this.image,
        0,
        0,
        this.width / this.frames,
        this.height,
        this.position.x,
        this.position.y,
        this.width / 2,
        this.height
      );
    } else if (this.type === "map") {
      // this.ctx.scale(3, 3);
      this.ctx.drawImage(this.image, this.position.x, this.position.y);
      // this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (this.type === "block") {
      // this.ctx.scale(-4, -4a=dd);
      this.ctx.drawImage(this.image, 0, this.position.y);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}
export default Sprite;
