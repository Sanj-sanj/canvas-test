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
    metadata: {
      type: string;
      spritePath: Vector;
      actors: [];
    };
  };
  ctx: CanvasRenderingContext2D;
};
type Vector = { x: number; y: number };

export type SpriteType = {
  draw: (offset: Vector) => void;
  log: (offset?: Vector) => void;
  buildCollisionData: (position: Vector) => {
    x: number;
    y: number;
  };
};

export default function Sprite({
  type,
  position,
  source,
  ctx,
}:
  | CharacterSprite
  | MapSprite
  | ColisionSprite
  | EnvironmentSpriteSheet): SpriteType {
  function draw(offset: { x: number; y: number }) {
    switch (type) {
      case "character":
        ctx.fillStyle = "red";
        ctx.fillRect(position.x, position.y, 32, 32);
        ctx.drawImage(
          source.img,
          0,
          0,
          source.width / source.frames.max,
          source.height,
          position.x,
          position.y,
          source.width * 1,
          source.height * 1
        );
        break;

      case "mapSpriteSheet":
        if (offset) {
          ctx.drawImage(
            source.img,
            source.spriteSize * source.metadata.spritePath.x, // x on sprite sheet
            source.spriteSize * source.metadata.spritePath.y, //y on sprite sheet
            32,
            32,
            position.x + offset.x,
            position.y + offset.y,
            32,
            32
          );
        }
        break;

      default:
        break;
    }
  }
  function log(offset?: Vector) {
    console.log({ type, position, source, offset });
  }

  function buildCollisionData(pos: Vector) {
    // ctx.fillStyle = "red";
    // ctx.fillRect(pos.x * scaling, pos.y * scaling, 32 * scaling, 32 * scaling);
    // ctx.fillStyle = "blue";
    // ctx.fillRect(
    //   pos.x * scaling + 24,
    //   pos.y * scaling + 24,
    //   16 * scaling,
    //   16 * scaling
    // );
    // console.log(pos.x);
    return { x: pos.x, y: pos.y };
  }
  return { draw, log, buildCollisionData };
}
