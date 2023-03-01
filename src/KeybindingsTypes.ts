export type Keybinds = {
  w: { pressed: boolean };
  s: { pressed: boolean };
  a: { pressed: boolean };
  d: { pressed: boolean };
  pause: { pressed: boolean };
  zoom: { pressed: boolean };
  attack: { pressed: boolean };
  secondaryAttack: { pressed: boolean; coords: { x: number; y: number } };
};

export type MovementKey = "w" | "a" | "s" | "d";
