import { MovementKey } from "./KeybindingsTypes";
export type CollisionState = {
  log: () => void;
  appendCollidable: ({ x, y }: Vector) => void;
  checkForCollision: (playerPos: Vector, direction: MovementKey) => boolean;
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
    direction: MovementKey
  ) {
    let topY = playerPos.y,
      topX = playerPos.x;
    if (direction === "w" || direction === "s") {
      direction === "w" ? (topY -= 4) : (topY += 14);
    }
    if (direction === "a" || direction === "d") {
      direction === "a" ? (topX -= 4) : (topX += 4);
    }

    //the minus 8 and minus 16 is to offset collision for player sprite on left and right and above head
    return collisions.some((rect) => {
      return (
        topX + 22 >= rect.x &&
        topX <= rect.x + 22 &&
        topY <= rect.y + 22 &&
        topY + 22 >= rect.y
      );
    });
  }

  function log() {
    console.log(collisions);
  }
  return { appendCollidable, log, checkForCollision };
}
export default Collisions;
