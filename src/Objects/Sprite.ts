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
type Sprite = {
  draw: (offset?: Vector) => void;
  log: (offset?: Vector) => void;
  buildCollisionData: (
    position: Vector,
    scaling: number
  ) => {
    // height: { start: number; end: number };
    // width: { start: number; end: number };
    gridY: number;
    gridX: number;
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
  | EnvironmentSpriteSheet): Sprite {
  function draw(offset?: { x: number; y: number }) {
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
          source.width * 1,
          source.height * 1
        );

        break;

      case "mapSpriteSheet":
        {
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
        }
        break;

      default:
        break;
    }
  }
  function log(offset?: Vector) {
    console.log({ type, position, source, offset });
  }
  //player
  // ctx.fillStyle = "red";
  // ctx.fillRect(128 * 3, 96 * 3, 32 * 3, 32 * 3);

  function buildCollisionData(pos: Vector, scaling: number) {
    ctx.fillStyle = "red";
    ctx.fillRect(pos.x * scaling, pos.y * scaling, 32 * scaling, 32 * scaling);
    const gridX = pos.x / 32,
      gridY = pos.y / 32;

    console.log(gridY, gridX);
    // return {
    //   width: {
    //     start: pos.x * scaling,
    //     end: pos.x * scaling + 32 * scaling,
    //   },
    //   height: {
    //     start: pos.y * scaling - 48,
    //     end: pos.y * scaling - 48 + 32 * scaling,
    //   },
    // };
    return { gridY, gridX };
  }
  return { draw, log, buildCollisionData };
}
