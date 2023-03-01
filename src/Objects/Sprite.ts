import { MovementKey } from "../KeybindingsTypes";
import {
  CharacterSpriteParams,
  EntitySpriteParams,
  EnvironmentSpriteSheetParams,
  Vector,
} from "./SpriteTypes";

export type MapTypeSprite = {
  buildCollisionData: (position: Vector) => {
    x: number;
    y: number;
  };
  log: (offset?: Vector) => void;
  draw: () => void;
  updateOffset: (newOffset: Vector) => void;
};
export type EntityTypeSprite = {
  draw: () => void;
  log: (offset?: Vector) => void;
  getRect: () => Rect;
  updateOffset: (offset: Vector) => void;
  knockBackSprite: ({ x, y }: Vector) => void;
  alterHp: (damage: number, modifier: "+" | "-") => number | undefined;
  killThisSprite: () => void;
};
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
    monster?: EntityTypeSprite
  ) => boolean;
  secondaryAttack: (start: Vector, destination: Vector) => void;
};

function SpriteEntity({
  type,
  position,
  source,
  ctx,
  stats,
}: EntitySpriteParams): EntityTypeSprite {
  let ticks = 0;
  const maxHp = stats.health;
  let spriteFrameIntervalID: null | number = null;
  let invulnerabilityID: number | null = null;
  let isUnderAttack = false;
  let statusDisplayCooldown: null | number = null;
  let lastDamageTaken = "";
  const offset = { x: 0, y: 0 };

  function draw() {
    if (stats.health >= 0) {
      if (isUnderAttack) {
        ctx.fillStyle = "red";
        ctx.fillRect(position.x + offset.x, position.y + offset.y - 16, 32, 8);
        ctx.fillStyle = "green";
        ctx.fillRect(
          position.x + offset.x,
          position.y + offset.y - 16,
          (stats.health / maxHp) * 32,
          8
        );
        if (typeof invulnerabilityID === "number") {
          ctx.fillStyle = "red";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText(
            lastDamageTaken,
            position.x + offset.x - 8,
            position.y + offset.y - 32
          );
        }
      }
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
      if (spriteFrameIntervalID !== null || source.frames.max === 1) return;
      spriteFrameIntervalID = setTimeout(() => tickTock(), 300);
    }
  }
  function log() {
    console.log({ type, position, source, offset });
    console.log(stats.health);
  }
  function updateOffset(offsetNew: Vector) {
    /*update offset is used to reset the offset value according to the value provided by main
     *which is responsible for offsetting camera position as the character moves around the map
     */
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  function knockBackSprite({ x, y }: Vector) {
    position.x += x;
    position.y += y;
  }
  function alterHp(
    incomingDamage: number,
    modifier: "+" | "-"
  ): number | undefined {
    isUnderAttack = true;
    if (invulnerabilityID) return;
    if (modifier === "+") stats.health += incomingDamage;
    else stats.health -= incomingDamage;
    lastDamageTaken = `${modifier}${incomingDamage}`;
    invulnerabilityID = setTimeout(() => {
      invulnerabilityID = null;
    }, 300);
    if (typeof statusDisplayCooldown === "number")
      clearTimeout(statusDisplayCooldown);
    statusDisplayCooldown = setTimeout(() => {
      isUnderAttack = false;
      statusDisplayCooldown = null;
    }, 2000);
    return stats.health;
  }
  function killThisSprite() {
    //this function will probably play out a death animation?
    console.log("im ded!");
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
    const max = 3, //max ammount of frames to cycle through the sprite
      min = 0; // reset index
    ticks === max ? (ticks = min) : (ticks += 1);
    spriteFrameIntervalID = null;
  }
  return {
    draw,
    log,
    getRect,
    updateOffset,
    knockBackSprite,
    alterHp,
    killThisSprite,
  };
}

function SpriteCharacter({
  type,
  position,
  source,
  ctx,
  stats,
  attack,
}: CharacterSpriteParams): CharacterTypeSprite {
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
  const secondaryAttPhysiscs = {
    currX: 0,
    currY: 0,
    offsetX: 1,
    offsetY: 1,
    baseSpeed: 6,
  };
  // let once = false;
  let secAttTimeout: null | number = null;
  function secondaryAttackHandler(start: Vector, destination: Vector) {
    if (typeof secAttTimeout === "number") secAttTimeout = null;
    function aoo() {
      secondaryAttPhysiscs.currX = start.x + secondaryAttPhysiscs.offsetX;
      secondaryAttPhysiscs.currY = start.y; //+ secondaryAttPhysiscs.speed;
      secondaryAttPhysiscs.offsetX += secondaryAttPhysiscs.baseSpeed;
      // once = true;
      secAttTimeout = setTimeout(() => {
        secondaryAttPhysiscs.offsetX = 1;
        // secondaryAttPhysiscs.baseSpeed
      }, 1000);
    }
    // if (once === false) aoo();
    aoo();
    ctx.fillStyle = "purple";
    const { currX, currY } = secondaryAttPhysiscs;

    ctx.fillRect(currX, currY, attack.secondary.width, attack.secondary.height);
    ctx.fillStyle = "yellow";
    ctx.fillRect(
      destination.x - 8,
      destination.y - 8,
      attack.secondary.width,
      attack.secondary.height
    );
  }
  function attackHandler(
    relativePosition: Vector,
    checkForCollisionCharacter: (rect0: Rect, rect1: Rect) => boolean,
    monster?: EntityTypeSprite
  ) {
    const knockbackValue = 3;
    let x = relativePosition.x,
      y = relativePosition.y,
      attW = attack.width,
      attH = attack.height;
    const knockBackOffset = { x: 0, y: 0 };
    if (direction === "d") {
      x += source.width / source.frames.max;
      knockBackOffset.x += knockbackValue;
    }
    if (direction === "a") {
      x -= attack.width;
      knockBackOffset.x -= knockbackValue;
    }
    if (direction === "w") {
      const temp = attW;
      attW = attH;
      attH = temp;
      y -= attack.width / source.frames.max;
      knockBackOffset.y -= knockbackValue;
    }
    if (direction === "s") {
      const temp = attH;
      attH = attW;
      attW = temp;
      y += attack.height;
      knockBackOffset.y += knockbackValue;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, attW, attH);
    if (
      monster &&
      checkForCollisionCharacter(monster.getRect(), {
        x: x,
        y: y,
        height: attH,
        width: attW,
      })
    ) {
      monster.knockBackSprite(knockBackOffset);
      const hp = monster.alterHp(stats.damage, "-");
      // monster.log();
      if (typeof hp === "number" && hp <= 0) {
        return true;
      }
    }
    return false;
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
  return {
    log,
    getPosition,
    draw,
    attack: attackHandler,
    changeDirection,
    secondaryAttack: secondaryAttackHandler,
  };
}
function SpriteMap({
  type,
  position,
  source,
  ctx,
}: EnvironmentSpriteSheetParams): MapTypeSprite {
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
  function buildCollisionData(pos: Vector) {
    return { x: pos.x, y: pos.y };
  }
  function updateOffset(offsetNew: Vector) {
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  return {
    log,
    draw,
    buildCollisionData,
    updateOffset,
  };
}

export { SpriteEntity, SpriteCharacter, SpriteMap };
