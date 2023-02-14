import Sprite from "./Objects/Sprite";

// each symobl will represent a number on the stylesheet
// * = tile 1
// { = tile 2
// [ = tile 3
// ^ = tile 4
// = = tile 5
type RenderParams = {
  mapString: string;
  ctx: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  tileSize: 16 | 32;
  offset: { x: number; y: number };
};
type Vec = { x: number; y: number };

// we will have to add in more params to the draw function inside renderer, it will porbably take actor data to display them later
type Renderer = { draw: (offset: Vec) => void; log: (offset?: Vec) => void };

const legend = {
  "*": { type: "grass", spritePath: { x: 0, y: 0 }, actors: [] },
  "{": { type: "water", spritePath: { x: 1, y: 0 }, actors: [] },
  "[": { type: "gravel", spritePath: { x: 2, y: 0 }, actors: [] },
  "^": { type: "ground", spritePath: { x: 3, y: 0 }, actors: [] },
  "=": { type: "stone wall", spritePath: { x: 4, y: 0 }, actors: [] },
  W: { type: "brick wall", spritePath: { x: 0, y: 1 }, actors: [] },
  "-": { type: "cave entrance", spritePath: { x: 1, y: 1 }, actors: [] },
  V: { type: "stairs down", spritePath: { x: 2, y: 1 }, actors: [] },
  X: { type: "tile floor", spritePath: { x: 3, y: 1 }, actors: [] },
  _: { type: "interior wall", spritePath: { x: 4, y: 1 }, actors: [] },
};
type MapTile = "*" | "{" | "[" | "^" | "=" | "W" | "-" | "V" | "X" | "_";

//we need to build all colidable elements into a big list to  be checked on main files keyboard press check in animate

function BuildMapSprite({
  ctx,
  mapString,
  spriteSheet,
  tileSize,
  offset,
}: RenderParams): Renderer[][] {
  return mapString
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      const SpriteObjectsArray = curr.split("").map((tile, x) => {
        return Sprite({
          ctx,
          type: "mapSpriteSheet",
          position: { x: x * tileSize + offset.x, y: y * tileSize + offset.y },
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
        }) as Renderer;
      });
      return [...acc, SpriteObjectsArray];
    }, [] as Renderer[][]) as unknown as Renderer[][];
}

export default BuildMapSprite;
