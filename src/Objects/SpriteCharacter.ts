import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
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

function SpriteCharacter(
  { source, stats, modifiers, initialFacingDirection }: CharacterSpriteParams,
  ctx: CanvasRenderingContext2D,
  collisions: CollisionState
): CharacterTypeSprite {
  let idTimeout: number | null = null;
  let ticks = 1;
  let direction: MovementKey = "down";
  let truePosition = { x: 0, y: 0 };
  let spriteCorrelatedToDirection = source.img[initialFacingDirection];

  function draw(relativePosition: Vector, isMoving: boolean) {
    // relativePdosition exists to handle respositioning player sprite on Zoom action.
    ctx.drawImage(
      spriteCorrelatedToDirection,
      (source.width / source.frames.max) * ticks,
      0,
      source.width / source.frames.max,
      source.height,
      relativePosition.x,
      relativePosition.y - 20,
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
    truePosition = { x: relativePosition.x, y: relativePosition.y };
    return;
  }

  function changeDirection(key: MovementKey | undefined) {
    if (!key) return;
    direction = key;
    const { up, down, left, right } = source.img;
    if (up && left && right)
      switch (key) {
        case "right":
          spriteCorrelatedToDirection = right;
          break;
        case "left":
          spriteCorrelatedToDirection = left;
          break;
        case "down":
          spriteCorrelatedToDirection = down;
          break;
        case "up":
          spriteCorrelatedToDirection = up;
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
        Math.floor(stats.strength * 0.25 + modifiers.attack.secondary.damage),
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
      y = truePosition.y,
      attW = modifiers.attack.primary.width,
      attH = modifiers.attack.primary.height;
    const knockBackOffset = { x: 0, y: 0 };
    if (direction === "right") {
      x += modifiers.attack.primary.width - 5;
      knockBackOffset.x += knockbackValue;
    }
    if (direction === "left") {
      x -= modifiers.attack.primary.width - 5;
      knockBackOffset.x -= knockbackValue;
    }
    if (direction === "up") {
      const temp = attW;
      attW = attH;
      attH = temp;
      y -= modifiers.attack.primary.height - 5;
      knockBackOffset.y -= knockbackValue;
    }
    if (direction === "down") {
      const temp = attH;
      attH = attW;
      attW = temp;
      y += modifiers.attack.primary.height - 5;
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
        Math.floor(stats.strength * 0.235 + modifiers.attack.primary.damage),
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
