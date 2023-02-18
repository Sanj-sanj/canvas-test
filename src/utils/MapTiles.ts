type Vec = { x: number; y: number };

export type MapTile =
  | "."
  | "~"
  | "["
  | "*"
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
  | "#";

type LegendEntry = {
  [key in MapTile]: {
    collisionType: "pass" | "impede";
    type: string;
    spritePath: Vec[];
    actors: [];
  };
};

const Legend: LegendEntry = {
  "!": {
    collisionType: "pass",
    type: "void",
    spritePath: [{ x: 0, y: 2 }],
    actors: [],
  },
  ".": {
    collisionType: "pass",
    type: "grass",
    spritePath: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    actors: [],
  },
  "~": {
    collisionType: "impede",
    type: "shallow water",
    spritePath: [{ x: 0, y: 3 }],
    actors: [],
  },
  "%": {
    collisionType: "impede",
    type: "deep water",
    spritePath: [{ x: 1, y: 3 }],
    actors: [],
  },
  "*": {
    collisionType: "pass",
    type: "dirt road",
    spritePath: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    actors: [],
  },
  "#": {
    collisionType: "pass",
    type: "cobble road",
    spritePath: [{ x: 6, y: 0 }],
    actors: [],
  },
  "/": {
    collisionType: "pass",
    type: "mud",
    spritePath: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ],
    actors: [],
  },
  "[": {
    collisionType: "pass",
    type: "gravel",
    spritePath: [{ x: 4, y: 2 }],
    actors: [],
  },
  "=": {
    collisionType: "impede",
    type: "stone wall",
    spritePath: [{ x: 3, y: 2 }],
    actors: [],
  },
  W: {
    collisionType: "impede",
    type: "brick wall",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
  },
  "-": {
    collisionType: "pass",
    type: "cave entrance",
    spritePath: [{ x: 2, y: 2 }],
    actors: [],
  },
  V: {
    collisionType: "pass",
    type: "stairs down",
    spritePath: [{ x: 4, y: 1 }],
    actors: [],
  },
  X: {
    collisionType: "pass",
    type: "tile floor",
    spritePath: [{ x: 5, y: 1 }],
    actors: [],
  },
  _: {
    collisionType: "impede",
    type: "building wall horizontal",
    spritePath: [{ x: 2, y: 1 }],
    actors: [],
  },
  "|": {
    collisionType: "impede",
    type: "building wall vertical",
    spritePath: [{ x: 3, y: 1 }],
    actors: [],
  },
  P: {
    collisionType: "pass",
    type: "ground plants",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
  },
};
export default Legend;
