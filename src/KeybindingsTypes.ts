export type Keybinds = {
  w: { pressed: boolean };
  s: { pressed: boolean };
  a: { pressed: boolean };
  d: { pressed: boolean };
  terminate: { pressed: boolean };
};
export type MovementKey = keyof Exclude<Keybinds, "terminate">;
