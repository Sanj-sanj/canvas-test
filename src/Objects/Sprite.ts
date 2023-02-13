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
// obsolete for teh time being
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

type EnvironmentSpriteSheet = {
  type: "mapSpriteSheet";
  position: { x: number; y: number };
  source: {
    spriteSize: 16 | 32;
    img: HTMLImageElement;
    width: number;
    height: number;
    spriteX: number;
    spriteY: number;
  };
  ctx: CanvasRenderingContext2D;
};

export default function Sprite({
  type,
  position,
  source,
  ctx,
}: CharacterSprite | MapSprite | ColisionSprite | EnvironmentSpriteSheet) {
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

      case "mapSpriteSheet":
        ctx.drawImage(
          source.img,
          source.spriteSize * source.spriteX, // x on sprite sheet
          source.spriteSize * source.spriteY, //y on sprite sheet
          32,
          32,
          position.x,
          position.y,
          32,
          32
        );

        break;

      default:
        break;
    }
  }
  function log() {
    console.log(type, position, source);
  }
  return { draw, log };
}
