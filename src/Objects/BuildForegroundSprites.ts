import SpriteMap from "./SpriteMap";
import { MapTypeSprite, Vector } from "./SpriteTypes";
import {
  ForegroundTile,
  ForegroundTileLegend,
} from "../utils/MapData/MapDefinitions";

type BuildForegroundParams = {
  entityData: string;
  ctx: CanvasRenderingContext2D;
  spriteSheet: HTMLImageElement;
  sheetData: {
    spriteSize: 32;
    sheetWidth: number;
    sheetHeight: number;
  };
  offset: { x: number; y: number };
  debug: boolean;
};

function BuildForegroundSprites(
  {
    ctx,
    entityData,
    spriteSheet,
    sheetData,
    offset,
    debug,
  }: BuildForegroundParams,
  appendCollisionData: (
    boxData: Vector,
    collisions: { walking: boolean; projectiles: boolean }
  ) => void
): MapTypeSprite[] {
  const Sprites: MapTypeSprite[] = [];
  entityData
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      [...curr].forEach((tile, x) => {
        if (tile === ".") return;
        const { spritePath, collision, tileName } =
          ForegroundTileLegend[tile as ForegroundTile];
        const thisPos = {
          x: x * sheetData.spriteSize + offset.x,
          y: y * sheetData.spriteSize + offset.y,
        };
        const spriteImgToUse = spritePath[0];
        const thisSprite = SpriteMap({
          ctx,
          position: thisPos,
          source: {
            img: spriteSheet,
            width: sheetData.sheetWidth,
            height: sheetData.sheetHeight,
            spriteSize: sheetData.spriteSize,
            metadata: {
              actors: [],
              spritePath: spriteImgToUse as Vector,
              collision,
            },
          },
          debug,
        });
        thisSprite.buildCollisionData(thisPos, appendCollisionData);
        Sprites.push(thisSprite);
      });
      return acc;
    }, []);
  return Sprites;
}

export default BuildForegroundSprites;
