import { AuxKey, Keybinds, MovementKey } from "./KeybindingsTypes";
import { Vector } from "../../../Objects/SpriteTypes";
import { CollisionState } from "../Collisions/CollisionTypes";

type KeybindParams = {
  animate: () => void;
  Collisions: CollisionState;
  keypressActions: {
    toggleZoom: () => void;
    updateOffset: (pos: "x" | "y", operand: "-" | "+", speed?: number) => void;
    updateLastClickPosition: (newPos: Vector) => void;
  };
};

function KeybindHandler({
  Collisions,
  animate,
  keypressActions: { toggleZoom, updateOffset, updateLastClickPosition },
}: KeybindParams) {
  const Keybinds: Keybinds = {
    movement: {
      up: { pressed: false, keybind: "w", action: "up" },
      down: { pressed: false, keybind: "s", action: "down" },
      left: { pressed: false, keybind: "a", action: "left" },
      right: { pressed: false, keybind: "d", action: "right" },
    },
    aux: {
      pause: { pressed: false, keybind: "]", action: "pause" },
      zoom: { pressed: false, keybind: "z", action: "zoom" },
      interaction: { pressed: false, keybind: "e", action: "interact" },
      attack: { pressed: false, keybind: "p", action: "attack" },
      secondaryAttack: {
        pressed: false,
        coords: { x: 0, y: 0 },
        action: "secondaryAttack",
      },
    },
  };
  // let haltMovement = false;
  let zoomOnCooldown = false;
  let attackCooldown = false;
  let secondaryAttackCooldown = false;

  function initControls() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousedown", handleMouseClick);
  }

  function unbindControls() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    canvas.removeEventListener("mousedown", handleMouseClick);
  }

  function checkIfPlayerMoving() {
    return Object.values(Keybinds.movement).some(
      ({ pressed }) => pressed === true
    );
  }

  function handleMouseClick(e: MouseEvent) {
    if (secondaryAttackCooldown) return;
    if (Keybinds.aux.secondaryAttack.pressed) return;
    secondaryAttackCooldown = true;
    Keybinds.aux.secondaryAttack.pressed = true;
    const targ = e.target as HTMLCanvasElement;
    const rect = targ.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    updateLastClickPosition({ x, y });
    // this timeout's duration number is the cooldown between new attacks
    setTimeout(() => (secondaryAttackCooldown = false), 400);
    // this number is to limit the number of times this function gets called in animation (calls only once per frame)
    setTimeout(() => (Keybinds.aux.secondaryAttack.pressed = false), 10);
  }
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === Keybinds.aux.pause.keybind) {
      // player.log(offset);
      console.count();
      // Collisions.log();
      Keybinds.aux.pause.pressed = !Keybinds.aux.pause.pressed;
      animate(); //force the loop to start again if debug has been toggled off -> on
    }
    if (e.key === Keybinds.aux.zoom.keybind) {
      if (zoomOnCooldown) return;
      Keybinds.aux.zoom.pressed = !Keybinds.aux.zoom.pressed;
      zoomOnCooldown = true;
      setTimeout(() => (zoomOnCooldown = false), 200);
      toggleZoom();
    }
    if (e.key === Keybinds.aux.interaction.keybind) {
      console.log("interact");
      Keybinds.aux.interaction.pressed = true; //!Keybinds.aux.interaction.pressed;
      setTimeout(() => (Keybinds.aux.interaction.pressed = false), 10);
    }
    if (e.key === Keybinds.aux.attack.keybind) {
      if (attackCooldown) return;
      const attackLingerDur = 100;
      if (Keybinds.aux.attack.pressed) return;
      attackCooldown = true;
      Keybinds.aux.attack.pressed = true;
      setTimeout(() => (Keybinds.aux.attack.pressed = false), attackLingerDur);
      setTimeout(() => (attackCooldown = false), 300);
    }
    const mvKey = e.key;
    const movementKey = Object.values(Keybinds.movement).find(
      (key) => key.keybind === mvKey
    );
    if (movementKey) {
      movementKey.pressed = true;
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    //called on keyup to stop movement
    const mvKey = e.key;
    const movementKeybind = Object.values(Keybinds.movement).find(
      (key) => key.keybind === mvKey
    );
    if (movementKeybind?.pressed) movementKeybind.pressed = false;
  }

  function keypressEventEmitter(coords: { x: number; y: number }, speed = 3) {
    // if (haltMovement) return;
    if (
      isKeyPressed("up", "movement") &&
      !Collisions.checkForCollisionMovement(
        { x: coords.x, y: coords.y },
        speed,
        "up"
      )
    ) {
      updateOffset("y", "+", speed);
      // Collisions.checkForCollisionTeleport(player.getRect(), offset)
    }
    if (
      isKeyPressed("down", "movement") &&
      !Collisions.checkForCollisionMovement(
        { x: coords.x, y: coords.y },
        speed,
        "down"
      )
    ) {
      updateOffset("y", "-", speed);
    }
    if (
      isKeyPressed("left", "movement") &&
      !Collisions.checkForCollisionMovement(
        { x: coords.x, y: coords.y },
        speed,
        "left"
      )
    ) {
      updateOffset("x", "+", speed);
    }
    if (
      isKeyPressed("right", "movement") &&
      !Collisions.checkForCollisionMovement(
        { x: coords.x, y: coords.y },
        speed,
        "right"
      )
    ) {
      updateOffset("x", "-", speed);
    }
  }

  function getMovingDirection() {
    return Object.values(Keybinds.movement).find(({ pressed }) => pressed)
      ?.action;
  }
  function isKeyPressed(key: MovementKey | AuxKey, type: "movement" | "aux") {
    if (type === "movement")
      return Keybinds.movement[key as MovementKey].pressed;
    return Keybinds.aux[key as AuxKey].pressed;
  }

  return {
    keypressEventEmitter,
    isKeyPressed,
    checkIfPlayerMoving,
    initControls,
    unbindControls,
    getMovingDirection,
  };
}
export default KeybindHandler;
