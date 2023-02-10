import { Keybinds } from "../KeybindingsTypes";

class Sprite {
  type;
  position;
  width;
  height;
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
    size,
  }: {
    type: "map" | "character" | "block";
    position: { x: number; y: number };
    ctx: CanvasRenderingContext2D;
    spritePNG: HTMLImageElement;
    frames?: number;
    bindings?: Keybinds;
    size: { height: number; width: number };
  }) {
    this.type = type;
    this.position = position;
    this.frames = frames || 1;
    this.ctx = ctx;
    this.keybinds = bindings;
    this.src = spritePNG;
    this.image = new Image();
    this.height = size.height;
    this.width = size.width;
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
      this.ctx.scale(3, 3);
      this.ctx.drawImage(this.image, this.position.x, this.position.y);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (this.type === "block") {
      this.ctx.scale(3, 3);
      this.ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}
export default Sprite;
