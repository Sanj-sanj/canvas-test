export type Keybinds = {
  movement: {
    up: { pressed: boolean; keybind: "w"; direction: "up" };
    down: { pressed: boolean; keybind: "s"; direction: "down" };
    left: { pressed: boolean; keybind: "a"; direction: "left" };
    right: { pressed: boolean; keybind: "d"; direction: "right" };
  };
  aux: {
    pause: { pressed: boolean; keybind: "]" };
    zoom: { pressed: boolean; keybind: "z" };
    attack: { pressed: boolean; keybind: "p" };
    secondaryAttack: { pressed: boolean; coords: { x: number; y: number } };
  };
};

export type MovementKey = "up" | "down" | "left" | "right";
export type AuxKey = "pause" | "zoom" | "attack" | "secondaryAttack";
