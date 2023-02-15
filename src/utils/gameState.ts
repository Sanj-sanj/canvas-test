import { Keybinds } from "../KeybindingsTypes";

type BoxData = {
  width: { start: number; end: number };
  height: { start: number; end: number };
};
type GridData = {
  gridX: number;
  gridY: number;
};
function gameState() {
  const collisions: GridData[] = [];
  const collisions2: { [k: string]: number[] } = {};

  function appendCollidable(boxData: GridData) {
    const y = boxData.gridY.toString();
    collisions.push(boxData);
    const acc = collisions2[y] || [];
    collisions2[y] = [...acc, boxData.gridX];
  }

  function checkForCollision(
    playerPos: { x: number; y: number },
    keybinds: Keybinds
  ) {
    if (Math.ceil(playerPos.y) in collisions2) {
      //   console.log(playerPos.y, playerPos.x);
      const key = Math.ceil(playerPos.y);

      if (collisions2[key].includes(Math.ceil(playerPos.x))) {
        console.log("colisions");
        console.log(Object.entries(keybinds));
      }
    }
  }

  function log() {
    // console.log(collisions);
    console.log(collisions2);
  }
  return { appendCollidable, log, checkForCollision };
}
export default gameState;
