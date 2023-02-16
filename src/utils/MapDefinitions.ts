type Vec = { x: number; y: number };

export type MapTile =
  | "*"
  | "~"
  | "["
  | "^"
  | "="
  | "W"
  | "-"
  | "V"
  | "X"
  | "_"
  | "!"
  | ">"
  | ":"
  | "P"
  | "%";

type LegendEntry = {
  [key in MapTile]: {
    collisionType: "pass" | "impede";
    type: string;
    spritePath: Vec;
    actors: [];
  };
};

const legend: LegendEntry = {
  "*": {
    collisionType: "pass",
    type: "grass",
    spritePath: { x: 0, y: 0 },
    actors: [],
  },
  "~": {
    collisionType: "impede",
    type: "water",
    spritePath: { x: 1, y: 0 },
    actors: [],
  },
  "[": {
    collisionType: "pass",
    type: "gravel",
    spritePath: { x: 2, y: 0 },
    actors: [],
  },
  "^": {
    collisionType: "pass",
    type: "ground",
    spritePath: { x: 3, y: 0 },
    actors: [],
  },
  "=": {
    collisionType: "impede",
    type: "stone wall",
    spritePath: { x: 4, y: 0 },
    actors: [],
  },
  W: {
    collisionType: "impede",
    type: "brick wall",
    spritePath: { x: 0, y: 1 },
    actors: [],
  },
  "-": {
    collisionType: "pass",
    type: "cave entrance",
    spritePath: { x: 1, y: 1 },
    actors: [],
  },
  V: {
    collisionType: "pass",
    type: "stairs down",
    spritePath: { x: 2, y: 1 },
    actors: [],
  },
  X: {
    collisionType: "pass",
    type: "tile floor",
    spritePath: { x: 3, y: 1 },
    actors: [],
  },
  _: {
    collisionType: "impede",
    type: "interior wall",
    spritePath: { x: 4, y: 1 },
    actors: [],
  },
  "!": {
    collisionType: "pass",
    type: "void",
    spritePath: { x: 0, y: 2 },
    actors: [],
  },
  ">": {
    collisionType: "pass",
    type: "weed ground",
    spritePath: { x: 1, y: 2 },
    actors: [],
  },
  ":": {
    collisionType: "pass",
    type: "shallow water",
    spritePath: { x: 2, y: 2 },
    actors: [],
  },
  P: {
    collisionType: "pass",
    type: "ground plants",
    spritePath: { x: 3, y: 2 },
    actors: [],
  },
  "%": {
    collisionType: "pass",
    type: "cobble",
    spritePath: { x: 4, y: 2 },
    actors: [],
  },
};
export default legend;
