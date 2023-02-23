import { CollisionState } from "./Collisions";
import { Keybinds, MovementKey } from "./KeybindingsTypes";
import { CharacterTypeSprite } from "./Objects/Sprite";

type KeybindParams = {
  animate: () => void;
  collidables: CollisionState;
  updateOffset: (pos: "x" | "y", operand: "-" | "+", speed?: number) => void;
  player: CharacterTypeSprite;
};

function KeybindHandler({
  animate,
  collidables,
  updateOffset,
  player,
}: KeybindParams) {
  const Keybinds: Keybinds = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    attack: { pressed: false },
    pause: { pressed: false },
    zoom: { pressed: false },
  };
  let haltMovement = false;
  let zoomOnCooldown = false;
  let attackCooldown = false;

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
      Keybinds.pause.pressed = !Keybinds.pause.pressed;
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
    if (e.key === "p") {
      if (attackCooldown) return;
      const attackLingerDur = 300;
      if (Keybinds.attack.pressed) return;
      attackCooldown = true;
      Keybinds.attack.pressed = true;
      setTimeout(() => (Keybinds.attack.pressed = false), attackLingerDur);
      setTimeout(() => (attackCooldown = false), 500);
    }
    const mvKey = e.key as MovementKey;
    if (mvKey in Keybinds) {
      player.changeDirection(mvKey);
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
      !collidables.checkForCollisionEnvironment(
        { x: coords.x, y: coords.y },
        speed,
        "w"
      )
    ) {
      updateOffset("y", "+", speed);
    }
    if (
      isKeyPressed("s") &&
      !collidables.checkForCollisionEnvironment(
        { x: coords.x, y: coords.y },
        speed,
        "s"
      )
    ) {
      updateOffset("y", "-", speed);
    }
    if (
      isKeyPressed("a") &&
      !collidables.checkForCollisionEnvironment(
        { x: coords.x, y: coords.y },
        speed,
        "a"
      )
    ) {
      updateOffset("x", "+", speed);
    }
    if (
      isKeyPressed("d") &&
      !collidables.checkForCollisionEnvironment(
        { x: coords.x, y: coords.y },
        speed,
        "d"
      )
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
