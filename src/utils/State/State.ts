import BuildMapSprite from "../../Objects/BuildMapSprites";
import BuildGameEntities from "../../Objects/BuildGameEntities";

import createMapAndEntityMetaData, {
  TeleportData,
} from "../MapData/MapAndEntityData";
import spriteSheet from "../../Assets/sprites.png";
import forgroundSpriteSheet from "../../Assets/foregroundSprites.png";
import mageLeft from "../../Assets/mage_left_v2.png";
import mageRight from "../../Assets/mage_right_v2.png";
import mageUp from "../../Assets/mage_up_v2.png";
import mageDown from "../../Assets/mage_down_v2.png";
import monImg from "../../Assets/monsprite.png";
import CameraHandler from "../Handlers/Camera/CameraHandler";
import CollisionHandler from "../Handlers/Collisions/CollisionHandler";
import KeybindHandler from "../Handlers/Keybinds/KeybindHandler";
import { LevelParams } from "./LevelBuilder";
import BuildForegroundSprites from "../../Objects/BuildForegroundSprites";
import DialogueBox from "../../Objects/DialogueBox";

const playerPicR = new Image();
const playerPicL = new Image();
const playerPicD = new Image();
const playerPicU = new Image();
const monsterPic = new Image();
const sheet = new Image();
const foregroundSheet = new Image();

playerPicR.src = mageRight;
playerPicL.src = mageLeft;
playerPicU.src = mageUp;
playerPicD.src = mageDown;
monsterPic.src = monImg;
sheet.src = spriteSheet;
foregroundSheet.src = forgroundSpriteSheet;

function State(
  canvas: { height: number; width: number },
  ctx: CanvasRenderingContext2D,
  animate: () => void,
  LevelData: LevelParams,
  newLevel?: TeleportData
) {
  const mapData = createMapAndEntityMetaData(LevelData);
  const Collisions = CollisionHandler();
  const Camera = CameraHandler({ height: canvas.height, width: canvas.width });
  const { updateOffset, toggleZoom, updateLastClickPosition } = Camera;
  const { offset } = Camera.cameraState;
  const Dialogue = DialogueBox();
  /*
    { initalOffset: { x: -210 / 2, y: -144 / 2 }, zoomEnalbed: true }
     this particular offset value will be used when loading a new map while the 
     player's zoomEnabled == true to combat the offset caused by zooming before positioning
     player sprite on the screen.
     */

  const Entities = BuildGameEntities(
    ctx,
    Collisions,
    mapData,
    {
      stats: {
        health: 100,
        strength: 25,
        dexterity: 10,
        durability: 12,
        magic: 26,
        speed: 4,
      },
      modifiers: {
        attack: {
          primary: {
            width: 32,
            height: 32,
            damage: 25,
          },
          secondary: {
            width: 16,
            height: 16,
            damage: 10,
          },
        },
        defense: {
          magic_durability: 20,
          physical_durability: 20,
        },
      },
      source: {
        frames: { min: 0, max: 3 },
        height: 48,
        width: 96,
        img: {
          left: playerPicL,
          right: playerPicR,
          up: playerPicU,
          down: playerPicD,
        },
      },
    },
    newLevel
  );

  const Control = KeybindHandler({
    animate,
    keypressActions: {
      toggleZoom: toggleZoom,
      updateLastClickPosition: updateLastClickPosition,
      updateOffset: updateOffset,
    },
    Collisions,
  });
  const MapTiles = BuildMapSprite(
    {
      ctx,
      mapData: mapData.mapString,
      offset: offset(),
      spriteSheet: sheet,
      sheetData: {
        sheetHeight: 160,
        sheetWidth: 224,
        spriteSize: 32,
      },
      debug: false,
    },
    Collisions.appendCollidable
  );

  const ForegroundTiles = BuildForegroundSprites(
    {
      ctx,
      entityData: mapData.foregroundString,
      spriteSheet: foregroundSheet,
      offset: offset(),
      sheetData: {
        sheetHeight: 128,
        sheetWidth: 128,
        spriteSize: 32,
      },
      debug: false,
    },
    Collisions.appendCollidable
  );
  /*
  Once the game level loads the player is centerd offset of canvas drawing start of the topleft which is x:0,y:0
  the following will take the screen center, get the newly loaded map's offset provided by the game Entity's layer map
  then we subtract the offset by the camera position to get the new relative position for our hero on game level loads.
  */
  const b = Camera.cameraState.screenCenter();
  const a = Collisions.getNewMapOffset();
  const newLevelPosition = { x: b.x - a.x, y: b.y - a.y };
  Camera.overrideOffset(newLevelPosition);

  //toggle zoom to adjust offset values after state has been setup for new level renders.
  LevelData.zoomEnabled ? toggleZoom() : null;
  return {
    Collisions,
    Control,
    Camera,
    MapTiles,
    ForegroundTiles,
    Entities,
    Dialogue,
  };
}
export default State;
