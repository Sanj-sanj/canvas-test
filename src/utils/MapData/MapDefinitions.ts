type Vec = { x: number; y: number };

export type MapTile =
  | "."
  | "~"
  | "@"
  | ":"
  | "^"
  | "*"
  | "$"
  | "/"
  | "="
  | "W"
  | "-"
  | "V"
  | "X"
  | "_"
  | "|"
  | "!"
  | "P"
  | "%"
  | "#"
  | "b"
  | "c"
  | "B"
  | "r"
  | "R"
  | "A"
  | "Q";

/*
  DepthLayer's walkable property is for defining where and where not a Entity/Character Sprite that is moveable can move to.
               collidable property is for defining where a Projectile Sprite cannot move to. (Collisions detection for projectiles) 
  */
export type LegendEntry<T extends string> = {
  [k in T]: {
    tileName: string;
    depthLayer: { walkable: boolean; collidable: boolean };
    spritePath: Vec[];
    actors: [];
  };
};

export const Legend: LegendEntry<MapTile> = {
  "!": {
    tileName: "void",
    spritePath: [{ x: 0, y: 2 }],
    actors: [],
    depthLayer: { walkable: false, collidable: false },
  },
  ".": {
    tileName: "grass",
    spritePath: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "~": {
    tileName: "shallow water",
    spritePath: [{ x: 0, y: 3 }],
    actors: [],
    depthLayer: { walkable: false, collidable: false },
  },
  "%": {
    tileName: "deep water",
    spritePath: [{ x: 1, y: 3 }],
    actors: [],
    depthLayer: { walkable: false, collidable: false },
  },
  "@": {
    tileName: "sand",
    spritePath: [{ x: 2, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  $: {
    tileName: "grassy dirt road",
    spritePath: [{ x: 3, y: 0 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "*": {
    tileName: "dirt road",
    spritePath: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "#": {
    tileName: "cobble road",
    spritePath: [{ x: 6, y: 0 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  c: {
    tileName: "cobble road with grass",
    spritePath: [{ x: 6, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "/": {
    tileName: "mud",
    spritePath: [
      { x: 5, y: 0 },
      { x: 4, y: 0 },
    ],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "^": {
    tileName: "stairs up",
    spritePath: [{ x: 4, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "=": {
    tileName: "horizontal stone wall",
    spritePath: [{ x: 3, y: 2 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  ":": {
    tileName: "vertical stone wall",
    spritePath: [{ x: 1, y: 2 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  W: {
    tileName: "brick wall",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  "-": {
    tileName: "cave entrance",
    spritePath: [{ x: 2, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  V: {
    tileName: "stairs down",
    spritePath: [{ x: 4, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  X: {
    tileName: "tile floor",
    spritePath: [{ x: 5, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  _: {
    tileName: "building wall horizontal",
    spritePath: [{ x: 1, y: 1 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  "|": {
    tileName: "building wall vertical",
    spritePath: [{ x: 3, y: 1 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  P: {
    tileName: "ground plants",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  b: {
    tileName: "small horizontal bride ",
    spritePath: [{ x: 5, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  r: {
    tileName: "small vertical bride ",
    spritePath: [{ x: 6, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  B: {
    tileName: "large horizontal bridge bottom",
    spritePath: [{ x: 3, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  R: {
    tileName: "large horizontal bridge top",
    spritePath: [{ x: 4, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  A: {
    tileName: "large vertical bridge  right",
    spritePath: [{ x: 5, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  Q: {
    tileName: "large vertical bridge left",
    spritePath: [{ x: 6, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
};
