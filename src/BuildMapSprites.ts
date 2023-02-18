import Sprite, { SpriteType } from "./Objects/Sprite";
import Legend, { MapTile } from "./utils/MapTiles";

type BuildMapParams = {
  mapString: string;
  ctx: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  tileSize: 16 | 32;

  offset: { x: number; y: number };
};
type Vec = { x: number; y: number };

// we will have to add in more params to the draw function inside renderer, it will porbably take actor data to display them later
// type Renderer = { draw: (offset: Vec) => void; log: (offset?: Vec) => void };

//we need to build all colidable elements into a big list to  be checked on main files keyboard press check in animate
function BuildMapSprite(
  { ctx, mapString, spriteSheet, tileSize, offset }: BuildMapParams,
  appendCollisionData: (boxData: Vec) => void
): SpriteType[] {
  return mapString
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      const SpritesArray = curr.split("").map((tile, x) => {
        const { type, spritePath, collisionType } = Legend[tile as MapTile];
        const thisPos = {
          x: x * tileSize + offset.x,
          y: y * tileSize + offset.y,
        };
        //some tiles have more than one tile available for drawing to spice things up
        let spriteImgToUse = spritePath[0];
        if (spritePath.length > 1) {
          spriteImgToUse = spritePath[
            Math.floor(Math.random() * spritePath.length)
          ] as Vec;
        }
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
              spritePath: spriteImgToUse as Vec,
              type: type,
            },
          },
        });
        collisionType === "impede"
          ? appendCollisionData(thisSprite.buildCollisionData(thisPos))
          : null;
        return thisSprite;
      });
      return [...acc, ...SpritesArray];
    }, [] as SpriteType[]);
}

export default BuildMapSprite;
