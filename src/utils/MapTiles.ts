type Vec = { x: number; y: number };

export type MapTile =
  | "."
  | "~"
  | "@"
  | ":"
  | "["
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

type LegendEntry = {
  [key in MapTile]: {
    type: string;
    depthLayer: { walkable: boolean; collidable: boolean };
    spritePath: Vec[];
    actors: [];
  };
};
/*
DepthLayer's walkable property is for defining where and where not a Entity/Character Sprite that is moveable can move to.
             collidable property is for defining where a Projectile Sprite cannot move to. (Collisions detection for projectiles) 
*/
const Legend: LegendEntry = {
  "!": {
    type: "void",
    spritePath: [{ x: 0, y: 2 }],
    actors: [],
    depthLayer: { walkable: false, collidable: false },
  },
  ".": {
    type: "grass",
    spritePath: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "~": {
    type: "shallow water",
    spritePath: [{ x: 0, y: 3 }],
    actors: [],
    depthLayer: { walkable: false, collidable: false },
  },
  "%": {
    type: "deep water",
    spritePath: [{ x: 1, y: 3 }],
    actors: [],
    depthLayer: { walkable: false, collidable: false },
  },
  "@": {
    type: "sand",
    spritePath: [{ x: 2, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  $: {
    type: "grassy dirt road",
    spritePath: [{ x: 3, y: 0 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "*": {
    type: "dirt road",
    spritePath: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "#": {
    type: "cobble road",
    spritePath: [{ x: 6, y: 0 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  c: {
    type: "cobble road with grass",
    spritePath: [{ x: 6, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "/": {
    type: "mud",
    spritePath: [
      { x: 5, y: 0 },
      { x: 4, y: 0 },
    ],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "[": {
    type: "lava",
    spritePath: [{ x: 4, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  "=": {
    type: "horizontal stone wall",
    spritePath: [{ x: 3, y: 2 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  ":": {
    type: "vertical stone wall",
    spritePath: [{ x: 1, y: 2 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  W: {
    type: "brick wall",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  "-": {
    type: "cave entrance",
    spritePath: [{ x: 2, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  V: {
    type: "stairs down",
    spritePath: [{ x: 4, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  X: {
    type: "tile floor",
    spritePath: [{ x: 5, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  _: {
    type: "building wall horizontal",
    spritePath: [{ x: 1, y: 1 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  "|": {
    type: "building wall vertical",
    spritePath: [{ x: 3, y: 1 }],
    actors: [],
    depthLayer: { walkable: false, collidable: true },
  },
  P: {
    type: "ground plants",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  b: {
    type: "small horizontal bride ",
    spritePath: [{ x: 5, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  r: {
    type: "small vertical bride ",
    spritePath: [{ x: 6, y: 2 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  B: {
    type: "large horizontal bridge bottom",
    spritePath: [{ x: 3, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  R: {
    type: "large horizontal bridge top",
    spritePath: [{ x: 4, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  A: {
    type: "large vertical bridge  right",
    spritePath: [{ x: 5, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
  Q: {
    type: "large vertical bridge left",
    spritePath: [{ x: 6, y: 3 }],
    actors: [],
    depthLayer: { walkable: true, collidable: false },
  },
};
export default Legend;
