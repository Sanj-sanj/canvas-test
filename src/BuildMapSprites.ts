import Sprite from "./Objects/Sprite";
import legend, { MapTile } from "./utils/MapDefinitions";

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
