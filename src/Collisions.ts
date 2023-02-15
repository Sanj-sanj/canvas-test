type Vector = {
  x: number;
  y: number;
};
function Collisions() {
  const collisions: Vector[] = [];

  function appendCollidable({ x, y }: Vector) {
    collisions.push({ x, y });
  }

  function checkForCollision(playerPos: { x: number; y: number }) {
    const topY = playerPos.y,
      topX = playerPos.x;
    //the minus 8 and minus 16 is to offset collision for player sprite on left and right and above head
    return collisions.some((rect) => {
      return (
        topX + 32 - 8 >= rect.x &&
        topX <= rect.x + 32 - 8 &&
        topY <= rect.y + 32 - 16 &&
        topY + 32 - 6 >= rect.y
      );
    });
  }

  function log() {
    console.log(collisions);
  }
  return { appendCollidable, log, checkForCollision };
}
export default Collisions;
