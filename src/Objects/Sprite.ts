import {
  CharacterSprite,
  EntitySprite,
  EnvironmentSpriteSheet,
  Vector,
} from "./SpriteTypes";

export interface MapTypeSprite extends EntityTypeSprite {
  buildCollisionData: (position: Vector) => {
    x: number;
    y: number;
  };
}
export interface EntityTypeSprite {
  draw: () => void;
  log: (offset?: Vector) => void;
  getPosition: () => Vector;
  updateOffset: (offset: Vector) => void;
}
type CharacterTypeSprite = {
  draw: (relativePostion: Vector) => void;
  log: () => void;
  getPosition: () => Vector;
};

function SpriteEntity({
  type,
  position,
  source,
  ctx,
}: EntitySprite): EntityTypeSprite {
  let ticks = 0;
  let id: null | number = null;
  const offset = { x: 0, y: 0 };

  function draw() {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(position.x + offset.x, position.y + offset.y, 32, 32);
    ctx.drawImage(
      source.img,
      (source.width / source.frames.max) * ticks,
      0,
      source.width / source.frames.max, // maximum number of frames in total of the provided sprite
      source.height,
      position.x + offset.x,
      position.y + offset.y,
      source.width / source.frames.max,
      source.height * 1
    );
    if (id !== null || source.frames.max === 1) return;
    id = setTimeout(() => tickTock(), 300);
  }
  function log(offset?: Vector) {
    console.log({ type, position, source, offset });
  }
  function updateOffset(offsetNew: Vector) {
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  function getPosition(): Vector {
    return position;
  }
  function tickTock() {
    ticks === 3 ? (ticks = 0) : (ticks += 1);
    id = null;
  }
  return { draw, log, getPosition, updateOffset };
}

function SpriteCharacter({
  type,
  position,
  source,
  ctx,
}: CharacterSprite): CharacterTypeSprite {
  let idTimeout: number | null = null;
  let ticks = 0;
  const helper = { log, draw, getPosition };

  function draw(relativePosition: Vector) {
    // relativePdosition exists to handle respositioning player sprite on Zoom action.
    ctx.drawImage(
      source.img,
      source.width * ticks,
      0,
      source.width / source.frames.max,
      source.height,
      relativePosition.x,
      relativePosition.y,
      source.width / source.frames.max,
      source.height * 1
    );
    if (idTimeout !== null || source.frames.max === 1) return helper;
    idTimeout = setTimeout(() => tickTock(), 300);
    return helper;
  }

  function log(offset?: Vector) {
    console.log({ type, position, source, offset });
  }
  function getPosition(): Vector {
    return position;
  }
  function tickTock() {
    ticks === 3 ? (ticks = 0) : (ticks += 1);
    idTimeout = null;
  }
  return { log, getPosition, draw };
}
function SpriteMap({
  type,
  position,
  source,
  ctx,
}: EnvironmentSpriteSheet): MapTypeSprite {
  const offset = { x: 0, y: 0 };
  function draw() {
    //  "mapSpriteSheet"
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
  function log(offset?: Vector) {
    console.log({ type, position, source, offset });
  }
  function getPosition(): Vector {
    return position;
  }
  function buildCollisionData(pos: Vector) {
    return { x: pos.x, y: pos.y };
  }
  function updateOffset(offsetNew: Vector) {
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  return { log, getPosition, draw, buildCollisionData, updateOffset };
}

export { SpriteEntity, SpriteCharacter, SpriteMap };
