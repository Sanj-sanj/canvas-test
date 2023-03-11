import collisions, { CollisionState } from "../Collisions";
import { MovementKey } from "../KeybindingsTypes";
import {
  CharacterSpriteParams,
  EntitySpriteParams,
  EnvironmentSpriteSheetParams,
  ProjectileTypeSprite,
  Vector,
} from "./SpriteTypes";

export type MapTypeSprite = {
  buildCollisionData: (
    position: Vector,
    appendCollidable: (
      arg: Vector,
      depthLayer: { walkable: boolean; collidable: boolean }
    ) => void
  ) => void;
  log: (offset?: Vector) => void;
  draw: () => void;
  updateOffset: (newOffset: Vector) => void;
};
export type EntityTypeSprite = {
  draw: () => void;
  log: (offset?: Vector) => void;
  getRect: () => Rect;
  updateOffset: (offset: Vector) => void;
  moveSprite: ({ x, y }: Vector, direction: MovementKey) => void;
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
  getRect: () => Rect;
  changeDirection: (key: MovementKey) => void;
  secondaryAttack: (
    monster: EntityTypeSprite,
    rect: Rect,
    offset: Vector
  ) => { isHit: boolean; finishingBlow: boolean; hitWall: boolean };
  attack: (monster?: EntityTypeSprite) => boolean;
};

/*
 * ============================================================================
 * ENTITY SPRITE BEGINS
 * LINE 55
 * ============================================================================
 */

function SpriteEntity({
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

  const rngNum = (n: number) => Math.round(Math.random() * n);

  type Direction = "up" | "down" | "left" | "right" | "wait";
  type Order = {
    direction: Direction;
    duration: number;
    inc: { x: number; y: number };
  };
  function wander(maxRange: number, entitySpeed: number) {
    const dir: Direction[] = [
      "up",
      "down",
      "left",
      "right",
      "wait",
      "wait",
      "wait",
      "wait",
      "wait",
      "wait",
    ];
    const orders: Order[] = [];
    function incremental(d: Direction) {
      if (d === "up") {
        return { y: -entitySpeed, x: 0 };
      }
      if (d === "down") {
        return { y: entitySpeed, x: 0 };
      }
      if (d === "right") {
        return { x: entitySpeed, y: 0 };
      }
      if (d === "left") {
        return { x: -entitySpeed, y: 0 };
      }
      return { x: 0, y: 0 };
    }
    function buildQueue() {
      for (let i = 0; i < 20; i++) {
        const pos = rngNum(dir.length - 1);
        orders.push({
          direction: dir[pos],
          duration: rngNum(maxRange),
          inc: incremental(dir[pos]),
        });
      }
    }
    function walk(): Order {
      const first = orders[0];
      if (!first) {
        buildQueue();
        return walk();
      }
      if (first.duration === 0) {
        orders.shift();
        return walk();
      }
      first.duration--;
      return first;
    }
    buildQueue();
    return { walk };
  }
  const directions = wander(80, stats.speed);
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
          ctx.save();
          ctx.fillStyle = "red";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText(
            lastDamageTaken,
            position.x + offset.x - 8,
            position.y + offset.y - 32
          );
          ctx.restore();
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
      const { inc, direction } = directions.walk();
      if (direction !== "wait") {
        moveSprite({ x: inc.x, y: inc.y }, direction);
      }

      if (spriteFrameIntervalID !== null || source.frames.max === 1) return;
      spriteFrameIntervalID = setTimeout(() => tickTock(), 300);
    }
  }
  function log() {
    console.log({ position, source, offset });
    console.log(stats.health);
  }
  function updateOffset(offsetNew: Vector) {
    /*update offset is used to reset the offset value according to the value provided by main
     *which is responsible for offsetting camera position as the character moves around the map
     */
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  function moveSprite({ x, y }: Vector, direction: MovementKey) {
    if (
      collisions.checkForCollisionMovement(
        { x: position.x, y: position.y },
        stats.speed,
        direction
      )
    )
      return;
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
    const max = 2, //max ammount of frames to cycle through the sprite
      min = 0; // reset index
    ticks === max ? (ticks = min) : (ticks += 1);
    spriteFrameIntervalID = null;
  }
  return {
    draw,
    log,
    getRect,
    updateOffset,
    moveSprite,
    alterHp,
    killThisSprite,
  };
}

/*
 * ============================================================================
 * CHARACTER SPRITE BEGINS
 * LINE 190
 * ============================================================================
 */

function SpriteCharacter({
  position,
  source,
  ctx,
  stats,
  attack,
}: CharacterSpriteParams): CharacterTypeSprite {
  let idTimeout: number | null = null;
  let ticks = 0;
  let direction: MovementKey = "right";
  let truePosition = { x: 0, y: 0 };
  let spriteCorrelatedToDirection = source.img.right;

  function draw(relativePosition: Vector) {
    truePosition = relativePosition;
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
    if (idTimeout !== null || source.frames.max === 1) return;
    idTimeout = setTimeout(() => tickTock(), 300);
    return;
  }

  function changeDirection(key: MovementKey) {
    direction = key;
    switch (key) {
      case "right":
        spriteCorrelatedToDirection = source.img.right;
        break;
      case "left":
        spriteCorrelatedToDirection = source.img.left;
        break;

      default:
        break;
    }
  }

  function secondaryAttack(
    monster: EntityTypeSprite,
    projectileRect: Rect,
    offset: Vector
  ) {
    const isHit = collisions.checkForCollisionSprite(
      projectileRect,
      monster.getRect()
    );
    const hitWall = collisions.checkForCollisionProjectile(
      projectileRect,
      offset
    );
    if (hitWall) return { finishingBlow: false, isHit, hitWall };
    if (isHit) {
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
        return { finishingBlow: true, isHit, hitWall };
      }
    }
    return { finishingBlow: false, isHit, hitWall };
  }

  function attackHandler(monster?: EntityTypeSprite) {
    const knockbackValue = 3;
    let x = truePosition.x,
      y = truePosition.y,
      attW = attack.primary.width,
      attH = attack.primary.height;
    const knockBackOffset = { x: 0, y: 0 };
    if (direction === "right") {
      x += source.width / source.frames.max;
      knockBackOffset.x += knockbackValue;
    }
    if (direction === "left") {
      x -= attack.primary.width;
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
    console.log({ position, source, offset });
  }
  function getRect(): Rect {
    return {
      ...truePosition,
      width: source.width / source.frames.max,
      height: source.height,
    };
  }
  function tickTock() {
    ticks === 3 ? (ticks = 0) : (ticks += 1);
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

/*
 * ============================================================================
 * SPRITE MAP BEGINS
 * LINE 355
 * ============================================================================
 */

function SpriteMap({
  position,
  source,
  ctx,
  debug,
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
    if (debug && source.metadata.depth.collidable) {
      ctx.font = "12zpx sans-serif";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(
        `x:${position.x + offset.x}`,
        position.x + offset.x,
        position.y + 14 + offset.y,
        32
      );
      ctx.strokeText(
        `y:${position.y + offset.y}`,
        position.x + offset.x,
        position.y + 26 + offset.y,
        32
      );

      ctx.fillStyle = "red";
      ctx.fillText(
        `x:${position.x + offset.x}`,
        position.x + offset.x,
        position.y + 14 + offset.y,
        32
      );
      ctx.fillText(
        `y:${position.y + offset.y}`,
        position.x + offset.x,
        position.y + 26 + offset.y,
        32
      );
    }
  }
  function log(offset?: Vector) {
    console.log({ position, source, offset });
  }
  function buildCollisionData(
    pos: Vector,
    appendCollidable: (
      arg: Vector,
      depthLayer: { walkable: boolean; collidable: boolean }
    ) => void
  ) {
    return appendCollidable({ x: pos.x, y: pos.y }, source.metadata.depth);
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
function SpriteProjectile(
  ctx: CanvasRenderingContext2D,
  secondaryAtt: { width: number; height: number }
): ProjectileTypeSprite {
  let iOffset: Vector;
  let currOffset: Vector = { x: 0, y: 0 };
  const attPhysiscs = {
    currX: 0,
    currY: 0,
    clickX: 0,
    clickY: 0,
    baseSpeed: 3,
    duration: {
      current: 90,
      total: 180,
    },
  };

  function setValues(
    start: Vector,
    destination: Vector,
    initialOffset: Vector
  ) {
    //initial offset should be a shallow copy to freeze values
    iOffset = initialOffset;
    attPhysiscs.clickX = destination.x;
    attPhysiscs.clickY = destination.y;
    attPhysiscs.currX = start.x;
    attPhysiscs.currY = start.y;
  }

  function moveProjectile() {
    const distX = attPhysiscs.clickX - (attPhysiscs.currX + 16),
      distY = attPhysiscs.clickY - (attPhysiscs.currY + 16);
    attPhysiscs.currX +=
      (distX / attPhysiscs.duration.current) * attPhysiscs.baseSpeed;
    attPhysiscs.currY +=
      (distY / attPhysiscs.duration.current) * attPhysiscs.baseSpeed;
  }

  function endAnimation() {
    attPhysiscs.duration.current = 0;
  }

  function draw(offset: Vector) {
    if (attPhysiscs.duration.current >= 1) {
      currOffset = {
        x: iOffset.x - offset.x,
        y: iOffset.y - offset.y,
      };
      ctx.fillStyle = "purple";
      ctx.fillRect(
        attPhysiscs.currX + 8 - currOffset.x,
        attPhysiscs.currY + 8 - currOffset.y,
        secondaryAtt.width,
        secondaryAtt.height
      );
      moveProjectile();
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        attPhysiscs.clickX - 8 - currOffset.x,
        attPhysiscs.clickY - 8 - currOffset.y,
        secondaryAtt.width,
        secondaryAtt.height
      );
      attPhysiscs.duration.current--;
      return true;
    }
    return false;
  }

  function getRect() {
    return {
      x: attPhysiscs.currX + 8 - currOffset.x,
      y: attPhysiscs.currY + 8 - currOffset.y,
      width: secondaryAtt.width,
      height: secondaryAtt.height,
    };
  }
  return { draw, setValues, getRect, endAnimation };
}

export { SpriteEntity, SpriteCharacter, SpriteMap, SpriteProjectile };
