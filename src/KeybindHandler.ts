import { CollisionState } from "./Collisions";
import { Keybinds, MovementKey } from "./KeybindingsTypes";
import { SpriteType } from "./Objects/Sprite";

type KeybindParams = {
  animate: () => void;
  player: SpriteType;
  collidables: CollisionState;
  updateOffset: (pos: "x" | "y", operand: "-" | "+", speed?: number) => void;
  offset: { x: number; y: number };
};

function KeybindHandler({
  animate,
  player,
  collidables,
  updateOffset,
  offset,
}: KeybindParams) {
  const keybinds: Keybinds = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    terminate: { pressed: false },
  };

  function toggleKeyPressed(key: MovementKey, bool: boolean) {
    keybinds[key].pressed = bool;
  }

  function initControls() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "]") {
      player.log(offset);
      collidables.log();
      keybinds.terminate.pressed = !keybinds.terminate.pressed;
      animate(); //force the loop to start again if debug has been toggled off -> on
    }
    const mvKey = e.key as MovementKey;
    if (mvKey in keybinds) return toggleKeyPressed(mvKey, true);
  }

  function handleKeyUp(e: KeyboardEvent) {
    //called on keyup to stop movement
    const mvKey = e.key as MovementKey;
    if (mvKey in keybinds) toggleKeyPressed(mvKey, false);
  }

  function updateKeypress(coords: { x: number; y: number }, speed = 3) {
    if (
      isKeyPressed("w") &&
      !collidables.checkForCollision({ x: coords.x, y: coords.y }, speed, "w")
    ) {
      updateOffset("y", "+", speed);
    }
    if (
      isKeyPressed("s") &&
      !collidables.checkForCollision({ x: coords.x, y: coords.y }, speed, "s")
    ) {
      updateOffset("y", "-", speed);
    }
    if (
      isKeyPressed("a") &&
      !collidables.checkForCollision({ x: coords.x, y: coords.y }, speed, "a")
    ) {
      updateOffset("x", "+", speed);
    }
    if (
      isKeyPressed("d") &&
      !collidables.checkForCollision({ x: coords.x, y: coords.y }, speed, "d")
    ) {
      updateOffset("x", "-", speed);
    }
  }

  function isKeyPressed(key: keyof Keybinds) {
    return keybinds[key].pressed;
  }

  return {
    updateKeypress,
    isKeyPressed,
    initControls,
  };
}
export default KeybindHandler;
