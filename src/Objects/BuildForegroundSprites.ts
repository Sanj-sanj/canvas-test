import SpriteMap from "./SpriteMap";
import { MapTypeSprite, Vector } from "./SpriteTypes";
import { LegendEntry } from "../utils/MapData/MapDefinitions";

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

type BlankTile = ".";
type ForegroundTile = "-" | "=" | BlankTile;

const ForegroundTileLegend: LegendEntry<ForegroundTile> = {
  "-": {
    actors: [],
    tileName: "building edge",
    depthLayer: { collidable: false, walkable: true },
    spritePath: [{ x: 0, y: 0 }],
  },
  "=": {
    tileName: "stone wall overhang",
    depthLayer: { collidable: false, walkable: true },
    spritePath: [{ x: 1, y: 0 }],
    actors: [],
  },
  ".": {
    actors: [],
    tileName: "void",
    depthLayer: { collidable: false, walkable: true },
    spritePath: [{ x: 0, y: 3 }],
  },
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
    depthLayer: { walkable: boolean; collidable: boolean }
  ) => void
): MapTypeSprite[] {
  const Sprites: MapTypeSprite[] = [];
  entityData
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      [...curr].forEach((tile, x) => {
        if (tile === ".") return;
        const { spritePath, depthLayer } =
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
              depth: depthLayer,
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
