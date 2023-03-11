export type Keybinds = {
  movement: {
    up: { pressed: boolean; keybind: "w"; action: "up" };
    down: { pressed: boolean; keybind: "s"; action: "down" };
    left: { pressed: boolean; keybind: "a"; action: "left" };
    right: { pressed: boolean; keybind: "d"; action: "right" };
  };
  aux: {
    pause: { pressed: boolean; keybind: "]"; action: "pause" };
    zoom: { pressed: boolean; keybind: "z"; action: "zoom" };
    attack: { pressed: boolean; keybind: "p"; action: "attack" };
    secondaryAttack: {
      pressed: boolean;
      coords: { x: number; y: number };
      action: "secondaryAttack";
    };
  };
};

export type MovementKey = "up" | "down" | "left" | "right";
export type AuxKey = "pause" | "zoom" | "attack" | "secondaryAttack";
