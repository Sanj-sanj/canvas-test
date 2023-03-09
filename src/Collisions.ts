import { MovementKey } from "./KeybindingsTypes";
export type CollisionState = {
  log: () => void;
  appendCollidable: ({ x, y }: Vector) => void;
  checkForCollisionEnvironment: (
    playerPos: Vector,
    speed: number,
    direction: MovementKey
  ) => boolean;
  checkForCollisionCharacter: (
    rect0: { x: number; y: number; width: number; height: number },
    rect1: { x: number; y: number; width: number; height: number }
  ) => boolean;
  checkForCollisionProjectile: (arg0: Rect, arg1: Vector) => boolean;
};
type Rect = { x: number; y: number; width: number; height: number };
type Vector = {
  x: number;
  y: number;
};
function Collisions(): CollisionState {
  /* 
  This function will contain all collision state related functions.
  collisions: Vector array of environment related tiles 
  */

  const collisions: Vector[] = [];

  function appendCollidable({ x, y }: Vector) {
    collisions.push({ x, y });
  }

  function checkForCollisionEnvironment(
    playerPos: { x: number; y: number },
    speed: number,
    direction: MovementKey
  ) {
    let topY = playerPos.y,
      topX = playerPos.x;
    if (direction === "w" || direction === "s") {
      direction === "w" ? (topY -= speed) : (topY += speed);
    }
    if (direction === "a" || direction === "d") {
      direction === "a" ? (topX -= speed) : (topX += speed);
    }
    //takes coord start of {x, y} then adds the width of the sprite, subtracting the speed of char / 2 to handle collision
    return collisions.some(({ x, y }) => {
      return (
        topX + 2 + 30 - speed / 2 >= x &&
        topX + 2 <= x + 30 - speed / 2 &&
        topY + 2 <= y + 30 - speed / 2 &&
        topY + 2 + 30 - speed / 2 >= y
      );
    });
  }

  function checkForCollisionProjectile(rect: Rect, offset: Vector) {
    return collisions.some(({ x, y }) => {
      return (
        rect.x + rect.width >= x + offset.x &&
        rect.x <= x + offset.x + 32 &&
        rect.y <= y + offset.y + 32 &&
        rect.y + rect.height >= y + offset.y
      );
    });
  }
  function checkForCollisionCharacter(rect0: Rect, rect1: Rect) {
    return (
      rect0.x + rect0.width >= rect1.x &&
      rect0.x <= rect1.x + rect1.width &&
      rect0.y <= rect1.y + rect1.height &&
      rect0.y + rect0.width >= rect1.y
    );
  }
  function log() {
    console.log(collisions);
  }
  return {
    appendCollidable,
    log,
    checkForCollisionEnvironment,
    checkForCollisionCharacter,
    checkForCollisionProjectile,
  };
}
export default Collisions;
