import { CollisionState } from "./Collisions";
import { Keybinds, MovementKey } from "./KeybindingsTypes";
import { CharacterTypeSprite } from "./Objects/Sprite";
import { Vector } from "./Objects/SpriteTypes";

type KeybindParams = {
  animate: () => void;
  collidables: CollisionState;
  player: CharacterTypeSprite;
  keypressActions: {
    toggleZoom: (zoomOn: boolean) => void;
    updateOffset: (pos: "x" | "y", operand: "-" | "+", speed?: number) => void;
    updateLastClickPosition: (newPos: Vector) => void;
  };
};

function KeybindHandler({
  animate,
  collidables,
  keypressActions: { toggleZoom, updateOffset, updateLastClickPosition },
  player,
}: KeybindParams) {
  const Keybinds: Keybinds = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    attack: { pressed: false },
    secondaryAttack: { pressed: false, coords: { x: 0, y: 0 } },
    pause: { pressed: false },
    zoom: { pressed: false },
  };
  // let haltMovement = false;
  let zoomOnCooldown = false;
  let attackCooldown = false;
  let secondaryAttackCooldown = false;

  function toggleKeyPressed(key: MovementKey, bool: boolean) {
    Keybinds[key].pressed = bool;
  }

  function initControls() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousedown", handleMouseClick);
  }

  function handleMouseClick(e: MouseEvent) {
    if (secondaryAttackCooldown) return;
    if (Keybinds.secondaryAttack.pressed) return;
    secondaryAttackCooldown = true;
    Keybinds.secondaryAttack.pressed = true;
    const targ = e.target as HTMLCanvasElement;
    const rect = targ.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    updateLastClickPosition({ x, y });
    // this timeout's duration number is the cooldown between new attacks
    setTimeout(() => (secondaryAttackCooldown = false), 500);
    // this number is to limit the number of times this function gets called in animation (calls only once per frame)
    setTimeout(() => (Keybinds.secondaryAttack.pressed = false), 10);
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
      zoomOnCooldown = true;
      setTimeout(() => (zoomOnCooldown = false), 200);
      toggleZoom(Keybinds.zoom.pressed);
    }
    if (e.key === "p") {
      if (attackCooldown) return;
      const attackLingerDur = 124;
      if (Keybinds.attack.pressed) return;
      attackCooldown = true;
      Keybinds.attack.pressed = true;
      setTimeout(() => (Keybinds.attack.pressed = false), attackLingerDur);
      setTimeout(() => (attackCooldown = false), 300);
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
    // if (haltMovement) return;
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
