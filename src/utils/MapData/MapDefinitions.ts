type Vec = { x: number; y: number };

export type TileCollisionTypes = {
  stopsWalking: boolean;
  stopsProjectiles: boolean;
};

export type LegendEntry<T extends string> = {
  [k in T]: {
    tileName: string;
    spritePath: Vec[];
    collisionData: TileCollisionTypes;
    actors: [];
  };
};
export type LegendEntryForeground<T extends string> = {
  [k in T]: {
    tileName: string;
    spritePath: Vec[];
    collisionData: TileCollisionTypes;
    actors: [];
    depth: "underground" | "ground" | "sky";
    interactivity?: {
      dialogue: boolean;
    };
  };
};

/**
 * Foreground Tile related data.
 */
type BlankTile = ".";
export type ForegroundTile = "-" | "=" | "T" | "@" | "^" | BlankTile;

export const ForegroundTileLegend: LegendEntryForeground<ForegroundTile> = {
  "-": {
    actors: [],
    tileName: "building edge",
    collisionData: { stopsProjectiles: false, stopsWalking: false },
    spritePath: [{ x: 0, y: 0 }],
    depth: "sky",
  },
  "=": {
    tileName: "stone wall overhang",
    collisionData: { stopsProjectiles: false, stopsWalking: false },
    spritePath: [{ x: 1, y: 0 }],
    depth: "sky",
    actors: [],
  },
  T: {
    actors: [],
    tileName: "wood sign post",
    collisionData: { stopsProjectiles: true, stopsWalking: true },
    spritePath: [{ x: 2, y: 1 }],
    depth: "ground",
    interactivity: {
      dialogue: true,
    },
  },
  "@": {
    actors: [],
    tileName: "bush",
    collisionData: { stopsProjectiles: true, stopsWalking: true },
    spritePath: [{ x: 1, y: 2 }],
    depth: "ground",
  },
  "^": {
    actors: [],
    tileName: "wall mounted sign",
    collisionData: { stopsProjectiles: true, stopsWalking: true },
    spritePath: [{ x: 3, y: 1 }],
    depth: "ground",
    interactivity: {
      dialogue: true,
    },
  },
  ".": {
    actors: [],
    tileName: "void",
    collisionData: { stopsProjectiles: false, stopsWalking: false },
    spritePath: [{ x: 0, y: 3 }],
    depth: "ground",
  },
};
/*
collisionData's stopsWalking property is for defining where and where not a Entity/Character Sprite that is moveable can move to.
stopsProjectiles property is for defining where a Projectile Sprite cannot move to. (Collisions detection for projectiles) 
*/
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
export const Legend: LegendEntry<MapTile> = {
  "!": {
    tileName: "void",
    spritePath: [{ x: 0, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: false },
  },
  ".": {
    tileName: "grass",
    spritePath: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  "~": {
    tileName: "shallow water",
    spritePath: [{ x: 0, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: false },
  },
  "%": {
    tileName: "deep water",
    spritePath: [{ x: 1, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: false },
  },
  "@": {
    tileName: "sand",
    spritePath: [{ x: 2, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  $: {
    tileName: "grassy dirt road",
    spritePath: [{ x: 3, y: 0 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  "*": {
    tileName: "dirt road",
    spritePath: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  "#": {
    tileName: "cobble road",
    spritePath: [{ x: 6, y: 0 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  c: {
    tileName: "cobble road with grass",
    spritePath: [{ x: 6, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  "/": {
    tileName: "mud",
    spritePath: [
      { x: 5, y: 0 },
      { x: 4, y: 0 },
    ],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  "^": {
    tileName: "stairs up",
    spritePath: [{ x: 4, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  "=": {
    tileName: "horizontal stone wall",
    spritePath: [{ x: 3, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: true },
  },
  ":": {
    tileName: "vertical stone wall",
    spritePath: [{ x: 1, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: true },
  },
  W: {
    tileName: "brick wall",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: true },
  },
  "-": {
    tileName: "cave entrance",
    spritePath: [{ x: 2, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  V: {
    tileName: "stairs down",
    spritePath: [{ x: 4, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  X: {
    tileName: "tile floor",
    spritePath: [{ x: 5, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  _: {
    tileName: "building wall horizontal",
    spritePath: [{ x: 1, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: true },
  },
  "|": {
    tileName: "building wall vertical",
    spritePath: [{ x: 3, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: true, stopsProjectiles: true },
  },
  P: {
    tileName: "ground plants",
    spritePath: [{ x: 0, y: 1 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  b: {
    tileName: "small horizontal bride ",
    spritePath: [{ x: 5, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  r: {
    tileName: "small vertical bride ",
    spritePath: [{ x: 6, y: 2 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  B: {
    tileName: "large horizontal bridge bottom",
    spritePath: [{ x: 3, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  R: {
    tileName: "large horizontal bridge top",
    spritePath: [{ x: 4, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  A: {
    tileName: "large vertical bridge  right",
    spritePath: [{ x: 5, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
  Q: {
    tileName: "large vertical bridge left",
    spritePath: [{ x: 6, y: 3 }],
    actors: [],
    collisionData: { stopsWalking: false, stopsProjectiles: false },
  },
};
