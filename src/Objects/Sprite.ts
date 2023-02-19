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
type EntitySprite = {
  type: "entity";
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

export interface SpriteType {
  // draw: (playersPosition: Vector) => void;
  draw: (offset: Vector, playersPosition: Vector) => void;
  log: (offset?: Vector) => void;
  buildCollisionData: (position: Vector) => {
    x: number;
    y: number;
  };
  getPosition: () => Vector;
}
type SpriteParams =
  | CharacterSprite
  | EntitySprite
  | MapSprite
  | ColisionSprite
  | EnvironmentSpriteSheet;

export default function Sprite({
  type,
  position,
  source,
  ctx,
}: SpriteParams): SpriteType {
  let ticks = 0;
  let id: null | number = null;

  // relativePosition exists to handle respositioning player sprite on Zoom action.
  function draw(
    offset: { x: number; y: number },
    relativePosition: { x: number; y: number }
  ) {
    switch (type) {
      case "character":
        ctx.fillStyle = "red";
        ctx.fillRect(relativePosition.x, relativePosition.y, 32, 32);
        ctx.drawImage(
          source.img,
          0,
          0,
          source.width / source.frames.max,
          source.height,
          relativePosition.x,
          relativePosition.y,
          source.width * 1,
          source.height * 1
        );
        break;
      case "entity":
        // ctx.fillStyle = "blue";
        // ctx.fillRect(position.x + offset.x, position.y + offset.y, 32, 32);
        ctx.drawImage(
          source.img,
          32 * ticks,
          0,
          source.width / source.frames.max,
          source.height,
          position.x + offset.x,
          position.y + offset.y,
          source.width / source.frames.max,
          source.height * 1
        );
        if (id !== null) return;
        id = setTimeout(() => tickTock(), 300);
        break;

      case "mapSpriteSheet":
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

        break;

      default:
        break;
    }
  }
  function log(offset?: Vector) {
    console.log({ type, position, source, offset });
  }

  function getPosition() {
    return position;
  }

  function tickTock() {
    ticks === 3 ? (ticks = 0) : (ticks += 1);
    console.log(ticks);
    id = null;
  }

  function buildCollisionData(pos: Vector) {
    return { x: pos.x, y: pos.y };
  }
  return { draw, log, buildCollisionData, getPosition };
}
