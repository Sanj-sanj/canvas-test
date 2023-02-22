import { CollisionState } from "./Collisions";
import { Keybinds, MovementKey } from "./KeybindingsTypes";

type KeybindParams = {
  animate: () => void;
  collidables: CollisionState;
  updateOffset: (pos: "x" | "y", operand: "-" | "+", speed?: number) => void;
};

function KeybindHandler({ animate, collidables, updateOffset }: KeybindParams) {
  const Keybinds: Keybinds = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    terminate: { pressed: false },
    zoom: { pressed: false },
  };
  let haltMovement = false;
  let zoomOnCooldown = false;

  function toggleKeyPressed(key: MovementKey, bool: boolean) {
    Keybinds[key].pressed = bool;
  }

  function initControls() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "]") {
      // player.log(offset);
      collidables.log();
      Keybinds.terminate.pressed = !Keybinds.terminate.pressed;
      animate(); //force the loop to start again if debug has been toggled off -> on
    }
    if (e.key === "z") {
      if (zoomOnCooldown) return;
      Keybinds.zoom.pressed = !Keybinds.zoom.pressed;
      haltMovement = true;
      zoomOnCooldown = true;
      setTimeout(() => (haltMovement = false), 100);
      setTimeout(() => (zoomOnCooldown = false), 200);
    }
    const mvKey = e.key as MovementKey;
    if (mvKey in Keybinds) {
      return toggleKeyPressed(mvKey, true);
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    //called on keyup to stop movement
    const mvKey = e.key as MovementKey;
    if (mvKey in Keybinds) toggleKeyPressed(mvKey, false);
  }

  function keypressEventEmitter(coords: { x: number; y: number }, speed = 3) {
    if (haltMovement) return;
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
    return Keybinds[key].pressed;
  }

  return {
    keypressEventEmitter,
    isKeyPressed,
    initControls,
  };
}
export default KeybindHandler;
