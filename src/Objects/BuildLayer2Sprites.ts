import SpriteMap from "./SpriteMap";
import { BuildMapCollisions, MapTypeSprite, Vector } from "./SpriteTypes";
import {
  ForegroundTile,
  ForegroundTileLegend,
} from "../utils/MapData/MapDefinitions";
import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";

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
  Collisions: CollisionState;
  dialogue?: string[][];
};

function BuildLayer2Sprites({
  ctx,
  entityData,
  spriteSheet,
  sheetData,
  offset,
  debug,
  dialogue,
  Collisions,
}: BuildForegroundParams): {
  ground: MapTypeSprite[];
  sky: MapTypeSprite[];
  underground: MapTypeSprite[];
} {
  const Sprites: {
    ground: MapTypeSprite[];
    sky: MapTypeSprite[];
    underground: MapTypeSprite[];
  } = { ground: [], sky: [], underground: [] };
  let dialogueInd = 0;
  entityData
    .trim()
    .split("\n")
    .reduce((acc, curr, y) => {
      [...curr].forEach((tile, x) => {
        if (tile === ".") return;
        const { spritePath, collisionData, tileName, depth, interactivity } =
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
              collisionData,
            },
          },
          debug,
        });
        if (interactivity) {
          if (dialogue && dialogueInd < dialogue.length) {
            Collisions.appendDialogue({
              position: thisPos,
              text: dialogue[dialogueInd],
            });
            dialogueInd++;
          }
        }
        Collisions.appendCollidable(thisPos, collisionData);

        Sprites[depth].push(thisSprite);
      });
      return acc;
    }, []);
  return Sprites;
}

export default BuildLayer2Sprites;
