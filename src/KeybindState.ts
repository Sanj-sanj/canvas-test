import { CollisionState } from "./Collisions";
import { Keybinds, MovementKey } from "./KeybindingsTypes";
import { Sprite } from "./Objects/Sprite";

type KeybindParams = {
  animate: () => void;
  player: Sprite;
  collidables: CollisionState;
  updateOffset: (pos: "x" | "y", operand: "-" | "+", speed?: number) => void;
  offset: { x: number; y: number };
};

function KeybindState({
  animate,
  player,
  collidables,
  updateOffset,
  offset,
}: KeybindParams) {
  let lastPressedMovementKey: "w" | "a" | "s" | "d";

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

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "]") {
      player.log(offset);
      collidables.log();
      keybinds.terminate.pressed = !keybinds.terminate.pressed;
      animate(); //force the loop to start again if debug has been toggled off -> on
    }

    const mvKey = e.key as MovementKey;
    lastPressedMovementKey = mvKey;
    if (mvKey in keybinds) return toggleKeyPressed(mvKey, true);
  }

  function handleKeyUp(e: KeyboardEvent) {
    //called on keyup to stop movement
    const mvKey = e.key as MovementKey;
    if (mvKey in keybinds) toggleKeyPressed(mvKey, false);
  }

  function handleCollision(coords: { x: number; y: number }) {
    if (collidables.checkForCollision(coords, lastPressedMovementKey)) {
      return true;
    }
    return false;
  }

  function updateKeypress(coords: { x: number; y: number }) {
    if (collidables.checkForCollision(coords, lastPressedMovementKey)) {
      keybinds[lastPressedMovementKey].pressed = false;
      return;
    }
    if (isKeyPressed("w")) {
      updateOffset("y", "+");
      lastPressedMovementKey = "w";
    }
    if (isKeyPressed("s")) {
      updateOffset("y", "-");
      lastPressedMovementKey = "s";
    }
    if (isKeyPressed("a")) {
      updateOffset("x", "+");
      lastPressedMovementKey = "a";
    }
    if (isKeyPressed("d")) {
      updateOffset("x", "-");
      lastPressedMovementKey = "d";
    }
  }

  function isKeyPressed(key: keyof Keybinds) {
    return keybinds[key].pressed;
  }

  return {
    updateKeypress,
    handleCollision,
    isKeyPressed,
    handleKeyDown,
    handleKeyUp,
  };
}
export default KeybindState;
