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
};
type Vector = {
  x: number;
  y: number;
};
function Collisions(): CollisionState {
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
    return collisions.some((rect) => {
      return (
        topX + 2 + 30 - speed / 2 >= rect.x &&
        topX + 2 <= rect.x + 30 - speed / 2 &&
        topY + 2 <= rect.y + 30 - speed / 2 &&
        topY + 2 + 30 - speed / 2 >= rect.y
      );
    });
  }

  function checkForCollisionCharacter(
    rect0: { x: number; y: number; width: number; height: number },
    rect1: { x: number; y: number; width: number; height: number }
  ) {
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
  };
}
export default Collisions;
