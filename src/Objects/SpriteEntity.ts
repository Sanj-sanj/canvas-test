import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
import { MovementKey } from "../utils/Handlers/Keybinds/KeybindingsTypes";
import { EntitySpriteParams, EntityTypeSprite, Vector } from "./SpriteTypes";

function SpriteEntity(
  { position, source, ctx, stats, modifiers }: EntitySpriteParams,
  collisions: CollisionState
): EntityTypeSprite {
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
    stop: boolean;
  };
  function wander(maxRange: number, entitySpeed: number) {
    let stop = false;
    const dir: Direction[] = ["up", "down", "left", "right", "wait", "wait"];
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
      for (let i = 0; i < 10; i++) {
        const pos = rngNum(dir.length - 1);
        orders.push({
          direction: dir[pos],
          duration: rngNum(maxRange),
          inc: incremental(dir[pos]),
          stop,
        });
      }
    }
    function halt() {
      stop = true;
    }
    function walk(): Order {
      if (stop) {
        return { direction: "wait", duration: 9999, inc: { x: 0, y: 0 }, stop };
      }
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
    return { walk, halt };
  }
  const directions = wander(80, stats.speed);
  function draw() {
    if (isUnderAttack) {
      // HP BAR
      ctx.fillStyle = "black";
      ctx.fillRect(
        position.x - 1 + offset.x,
        position.y - 1 + offset.y - 16,
        34,
        10
      );
      ctx.fillStyle = "red";
      ctx.fillRect(position.x + offset.x, position.y + offset.y - 16, 32, 8);
      ctx.fillStyle = "green";
      ctx.fillRect(
        position.x + offset.x,
        position.y + offset.y - 16,
        stats.health > 0 ? (stats.health / maxHp) * 32 : 0,
        8
      );
      if (typeof invulnerabilityID === "number") {
        // DAMAGE OVER HP TEXT
        ctx.save();
        ctx.font = "bold 24px sans-serif";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText(
          lastDamageTaken,
          position.x + offset.x - 8,
          position.y + offset.y - 32
        );
        ctx.fillStyle = "white";
        ctx.fillText(
          lastDamageTaken,
          position.x + offset.x - 8,
          position.y + offset.y - 32
        );
        ctx.restore();
      }
    }
    // ACTUAL SPRITE
    ctx.drawImage(
      source.img.down,
      (source.width / source.frames.max) * ticks,
      0,
      source.width / source.frames.max, // maximum number of frames in total of the provided sprite
      source.height,
      position.x + offset.x,
      position.y + offset.y,
      source.width / source.frames.max,
      source.height * 1
    );
    const { inc, direction, stop } = directions.walk();
    if (direction !== "wait" && stop !== true) {
      moveSprite({ x: inc.x, y: inc.y }, direction);
    }

    if (spriteFrameIntervalID !== null || source.frames.max === 1) return;
    spriteFrameIntervalID = setTimeout(() => tickTock(), 300);
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
    }, 3000);
    return stats.health;
  }
  function killThisSprite() {
    //this function will probably play out a death animation?
    console.log("im ded!");
    directions.halt();
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

export default SpriteEntity;
