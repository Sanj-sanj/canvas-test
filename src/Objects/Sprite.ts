import { MovementKey } from "../KeybindingsTypes";
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
  getRect: () => Rect;
  updateOffset: (offset: Vector) => void;
}
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CharacterTypeSprite = {
  draw: (relativePostion: Vector) => void;
  log: () => void;
  getPosition: () => Vector;
  changeDirection: (key: MovementKey) => void;
  attack: (
    relativePosition: Vector,
    checkForCollisionCharacter: (rect0: Rect, rect1: Rect) => boolean,
    monsterRect: Rect
  ) => void;
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
  function getRect() {
    const rect = {
      x: position.x + offset.x,
      y: position.y + offset.y,
      width: source.width / source.frames.max,
      height: source.height,
    };
    return rect;
  }
  function tickTock() {
    ticks === 3 ? (ticks = 0) : (ticks += 1);
    id = null;
  }
  return { draw, log, getRect, updateOffset };
}

function SpriteCharacter({
  type,
  position,
  source,
  ctx,
  stats,
  attack,
}: CharacterSprite): CharacterTypeSprite {
  let idTimeout: number | null = null;
  let ticks = 0;
  const helper = { log, draw, getPosition };
  let direction: MovementKey = "d";

  let spriteCorrelatedToDirection = source.img.right;

  function draw(relativePosition: Vector) {
    // relativePdosition exists to handle respositioning player sprite on Zoom action.
    ctx.drawImage(
      spriteCorrelatedToDirection,
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

  function changeDirection(key: MovementKey) {
    direction = key;
    switch (key) {
      case "d":
        spriteCorrelatedToDirection = source.img.right;
        break;
      case "a":
        spriteCorrelatedToDirection = source.img.left;
        break;

      default:
        break;
    }
  }
  function attackNow(
    relativePosition: Vector,
    checkForCollisionCharacter: (rect0: Rect, rect1: Rect) => boolean,
    monsterRect: Rect
  ) {
    let x = relativePosition.x,
      y = relativePosition.y,
      attW = attack.width,
      attH = attack.height;
    if (direction === "d") {
      x += source.height; // 32
    }
    if (direction === "a") {
      x -= source.height * 2; //64
    }
    if (direction === "w") {
      const temp = attW;
      attW = attH;
      attH = temp;
      y -= source.height * 2; //64
    }
    if (direction === "s") {
      const temp = attH;
      attH = attW;
      attW = temp;
      y += source.height; // 32
    }
    if (
      checkForCollisionCharacter(monsterRect, {
        x: x,
        y: y,
        height: attH,
        width: attW,
      })
    ) {
      console.log("hit");
    }

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, attW, attH);
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
  return { log, getPosition, draw, attack: attackNow, changeDirection };
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
  function getRect() {
    const rect = {
      x: position.x,
      y: position.y,
      width: source.width,
      height: source.height,
    };
    return rect;
  }
  function buildCollisionData(pos: Vector) {
    return { x: pos.x, y: pos.y };
  }
  function updateOffset(offsetNew: Vector) {
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  return { log, draw, getRect, buildCollisionData, updateOffset };
}

export { SpriteEntity, SpriteCharacter, SpriteMap };
