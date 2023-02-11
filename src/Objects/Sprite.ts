type CharacterSprite = {
  type: "character";
  position: { x: number; y: number };
  source: {
    img: HTMLImageElement;
    width: number;
    height: number;
    frames: { min: number; max: number };
  };
  ctx: CanvasRenderingContext2D;
};
type MapSprite = {
  type: "map";
  position: { x: number; y: number };
  source: {
    img: HTMLImageElement;
  };
  ctx: CanvasRenderingContext2D;
};
type ColisionSprite = {
  type: "block";
  position: { x: number; y: number };
  source: {
    img: HTMLImageElement;
    width: number;
    height: number;
  };
  ctx: CanvasRenderingContext2D;
};

export default function Sprite({
  type,
  position,
  source,
  ctx,
}: CharacterSprite | MapSprite | ColisionSprite) {
  function draw() {
    switch (type) {
      case "character":
        ctx.drawImage(
          source.img,
          0,
          0,
          source.width / source.frames.max,
          source.height,
          position.x,
          position.y,
          source.width / 2,
          source.height
        );
        break;
      case "map":
        ctx.scale(3, 3);
        ctx.drawImage(source.img, position.x, position.y);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        break;

      case "block":
        ctx.scale(3, 3);
        ctx.drawImage(
          source.img,
          position.x,
          position.y,
          source.width,
          source.height
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        break;
      default:
        break;
    }
  }
  return { draw };
}
