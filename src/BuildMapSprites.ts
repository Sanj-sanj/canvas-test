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
  spirteSheet: HTMLImageElement;
  tileSize: 16 | 32;
  offset: { x: number; y: number };
};

type Renderer = { draw: () => void; log: () => void };
const legend = {
  "*": 0,
  "{": 1,
  "[": 2,
  "^": 3,
  "-": 4,
};
type MapTile = "*" | "{" | "[" | "^" | "-";

function BuildMapSprite({
  ctx,
  mapString,
  spirteSheet,
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
            img: spirteSheet,
            width: 160,
            height: 96,
            spriteSize: 32,
            spriteX: legend[tile as MapTile],
            spriteY: 0,
          },
        }) as Renderer;
      });
      return [...acc, SpriteObjectsArray];
    }, [] as Renderer[][]) as unknown as Renderer[][];
}

export default BuildMapSprite;
