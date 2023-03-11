import SpriteMap from "./Objects/SpriteMap";
import { MapTypeSprite, Vector } from "./Objects/SpriteTypes";
import Legend, { MapTile } from "./utils/MapTiles";

type BuildMapParams = {
  mapString: string;
  ctx: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  tileSize: 16 | 32;
  offset: { x: number; y: number };
  debug: boolean;
};

function BuildMapSprite(
  { ctx, mapString, spriteSheet, tileSize, offset, debug }: BuildMapParams,
  appendCollisionData: (
    boxData: Vector,
    depthLayer: { walkable: boolean; collidable: boolean }
  ) => void
): MapTypeSprite[] {
  return mapString
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      const SpritesArray = curr.split("").map((tile, x) => {
        const { type, spritePath, depthLayer } = Legend[tile as MapTile];
        const thisPos = {
          x: x * tileSize + offset.x,
          y: y * tileSize + offset.y,
        };
        //some tiles have more than one tile available for drawing to spice things up
        let spriteImgToUse = spritePath[0];
        if (spritePath.length > 1) {
          const mod = Math.floor(Math.random() * 5);
          spriteImgToUse = spritePath[mod === 0 ? 1 : 0] as Vector;
        }
        const thisSprite = SpriteMap({
          ctx,
          position: thisPos,
          source: {
            img: spriteSheet,
            width: 160,
            height: 96,
            spriteSize: 32,
            metadata: {
              actors: [],
              spritePath: spriteImgToUse as Vector,
              depth: depthLayer,
            },
          },
          debug,
        });

        thisSprite.buildCollisionData(thisPos, appendCollisionData);
        return thisSprite;
      });
      return [...acc, ...SpritesArray];
    }, [] as MapTypeSprite[]);
}

export default BuildMapSprite;
