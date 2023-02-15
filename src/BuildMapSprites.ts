import Sprite from "./Objects/Sprite";

// each symobl will represent a number on the stylesheet
// * = tile 1
// { = tile 2
// [ = tile 3
// ^ = tile 4
// = = tile 5
type BuildMapParams = {
  mapString: string;
  ctx: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  tileSize: 16 | 32;
  scaling: number;
  offset: { x: number; y: number };
};
type Vec = { x: number; y: number };

// we will have to add in more params to the draw function inside renderer, it will porbably take actor data to display them later
type Renderer = { draw: (offset: Vec) => void; log: (offset?: Vec) => void };

const legend: LegendEntry = {
  "*": {
    collisionType: "pass",
    type: "grass",
    spritePath: { x: 0, y: 0 },
    actors: [],
  },
  "{": {
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
  "~": {
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
type MapTile =
  | "*"
  | "{"
  | "["
  | "^"
  | "="
  | "W"
  | "-"
  | "V"
  | "X"
  | "_"
  | "~"
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

//we need to build all colidable elements into a big list to  be checked on main files keyboard press check in animate
function BuildMapSprite(
  { ctx, mapString, spriteSheet, tileSize, scaling, offset }: BuildMapParams,
  appendCollisionData: (boxData: Vec) => void
): Renderer[][] {
  return mapString
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      const SpriteObjectsArray = curr.split("").map((tile, x) => {
        const thisPos = {
          x: x * tileSize + offset.x,
          y: y * tileSize + offset.y,
        };
        const thisSprite = Sprite({
          ctx,
          type: "mapSpriteSheet",
          position: thisPos,
          source: {
            img: spriteSheet,
            width: 160,
            height: 96,
            spriteSize: 32,
            metadata: {
              actors: [],
              spritePath: legend[tile as MapTile].spritePath,
              type: legend[tile as MapTile].type,
            },
          },
        });
        legend[tile as MapTile].collisionType === "impede"
          ? appendCollisionData(thisSprite.buildCollisionData(thisPos, scaling))
          : null;
        return thisSprite;
      });
      return [...acc, SpriteObjectsArray];
    }, [] as Renderer[][]) as unknown as Renderer[][];
}

export default BuildMapSprite;
