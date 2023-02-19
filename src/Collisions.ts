import { MovementKey } from "./KeybindingsTypes";
export type CollisionState = {
  log: () => void;
  appendCollidable: ({ x, y }: Vector) => void;
  checkForCollision: (
    playerPos: Vector,
    speed: number,
    direction: MovementKey
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

  function checkForCollision(
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

  function log() {
    console.log(collisions);
  }
  return { appendCollidable, log, checkForCollision };
}
export default Collisions;
