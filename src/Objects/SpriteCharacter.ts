import { MovementKey } from "../utils/Handlers/Keybinds/KeybindingsTypes";

import {
  CharacterSpriteParams,
  EntityTypeSprite,
  Rect,
  Vector,
} from "./SpriteTypes";

export type CharacterTypeSprite = {
  draw: (relativePostion: Vector, isMoving: boolean) => void;
  log: () => void;
  getRect: () => Rect;
  changeDirection: (key: MovementKey | undefined) => void;
  secondaryAttack: (
    monster: EntityTypeSprite,
    hasHitMon: boolean
  ) => { finishingBlow: boolean };
  attack: (monster?: EntityTypeSprite) => boolean;
};

function SpriteCharacter({
  collisions,
  source,
  ctx,
  stats,
  attack,
}: CharacterSpriteParams): CharacterTypeSprite {
  let idTimeout: number | null = null;
  let ticks = 1;
  let direction: MovementKey = "down";
  let truePosition = { x: 0, y: 0 };
  let spriteCorrelatedToDirection = source.img.down;

  function draw(relativePosition: Vector, isMoving: boolean) {
    // relativePdosition exists to handle respositioning player sprite on Zoom action.
    ctx.drawImage(
      spriteCorrelatedToDirection,
      (source.width / source.frames.max) * ticks,
      0,
      source.width / source.frames.max,
      source.height,
      relativePosition.x,
      relativePosition.y - 18,
      source.width / source.frames.max,
      source.height * 1
    );
    if (isMoving) {
      if (idTimeout !== null || source.frames.max === 1) return;
      idTimeout = setTimeout(() => {
        tickTock();
        idTimeout = null;
      }, 300);
    } else {
      ticks = 1;
    }
    truePosition = relativePosition;
    return;
  }

  function changeDirection(key: MovementKey | undefined) {
    if (!key) return;
    direction = key;
    switch (key) {
      case "right":
        spriteCorrelatedToDirection = source.img.right;
        break;
      case "left":
        spriteCorrelatedToDirection = source.img.left;
        break;
      case "down":
        spriteCorrelatedToDirection = source.img.down;
        break;
      case "up":
        spriteCorrelatedToDirection = source.img.up;
        break;

      default:
        break;
    }
  }

  function secondaryAttack(monster: EntityTypeSprite, hasHitMon: boolean) {
    if (hasHitMon) {
      // const kbValue = 3;
      // let kbX = 0,
      //   kbY = 0;
      // const monRect = monster.getRect();
      // if (projectileRect.y > monRect.y) {
      //   kbY += kbValue;
      // } else {
      //   kbY -= kbValue;
      // }
      // if (projectileRect.x > monRect.x) {
      //   kbX -= kbValue;
      // } else {
      //   kbX += kbValue;
      // }
      // monster.moveSprite({ x: kbX, y: kbY },);
      const hp = monster.alterHp(
        Math.floor(stats.strength * 0.25 + attack.secondary.damage),
        "-"
      );
      if (typeof hp === "number" && hp <= 0) {
        return { finishingBlow: true };
      }
    }
    return { finishingBlow: false };
  }

  function attackHandler(monster?: EntityTypeSprite) {
    const knockbackValue = 3;
    let x = truePosition.x,
      y = truePosition.y - 16,
      attW = attack.primary.width,
      attH = attack.primary.height;
    const knockBackOffset = { x: 0, y: 0 };
    if (direction === "right") {
      x += attack.primary.width - 5;
      knockBackOffset.x += knockbackValue;
    }
    if (direction === "left") {
      x -= attack.primary.width - 5;
      knockBackOffset.x -= knockbackValue;
    }
    if (direction === "up") {
      const temp = attW;
      attW = attH;
      attH = temp;
      y -= attack.primary.width / source.frames.max;
      knockBackOffset.y -= knockbackValue;
    }
    if (direction === "down") {
      const temp = attH;
      attH = attW;
      attW = temp;
      y += attack.primary.height;
      knockBackOffset.y += knockbackValue;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, attW, attH);
    if (
      monster &&
      collisions.checkForCollisionSprite(monster.getRect(), {
        x: x,
        y: y,
        height: attH,
        width: attW,
      })
    ) {
      monster.moveSprite(knockBackOffset, direction);
      const hp = monster.alterHp(
        Math.floor(stats.strength * 0.235 + attack.primary.damage),
        "-"
      );
      // monster.log();
      if (typeof hp === "number" && hp <= 0) {
        return true;
      }
    }
    return false;
  }
  function log(offset?: Vector) {
    console.log({ source, offset });
  }
  function getRect(): Rect {
    return {
      ...truePosition,
      width: source.width / source.frames.max,
      height: source.height,
    };
  }
  function tickTock() {
    ticks === source.frames.max - 1 ? (ticks = 0) : (ticks += 1);
    idTimeout = null;
  }
  return {
    log,
    getRect,
    draw,
    attack: attackHandler,
    secondaryAttack,
    changeDirection,
  };
}
export default SpriteCharacter;
