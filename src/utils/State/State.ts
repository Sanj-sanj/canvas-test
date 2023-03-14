import BuildMapSprite from "../../BuildMapSprites";
import BuildGameEntities from "../../Objects/BuildGameEntities";

import SpriteCharacter from "../../Objects/SpriteCharacter";
import createMapMetaData from "../MapStrings";
import spriteSheet from "../../Assets/sprites.png";
import mageLeft from "../../Assets/mageLeft.png";
// import mageRight from "../../Assets/mageRight.png";
import mageRight2 from "../../Assets/mageV2.png";
import monImg from "../../Assets/monsprite.png";
import CameraHandler from "../Handlers/Camera/CameraHandler";
import CollisionHandler from "../Handlers/Collisions/CollisionHandler";
import KeybindHandler from "../Handlers/Keybinds/KeybindHandler";
import { Vector } from "../../Objects/SpriteTypes";

const playerPicR = new Image();
const playerPicL = new Image();
const monsterPic = new Image();
const sheet = new Image();
// playerPicR.src = mageRight;
playerPicR.src = mageRight2;
playerPicL.src = mageLeft;
monsterPic.src = monImg;
sheet.src = spriteSheet;

function State(
  canvas: { height: number; width: number },
  ctx: CanvasRenderingContext2D,
  animate: () => void,
  LevelParams: {
    mapName: "startingPoint" | "smallTown";
    lastScreenOffset: Vector;
    newScreenOffset: Vector;
  }
) {
  const mapData = createMapMetaData(LevelParams);
  const Collisions = CollisionHandler();
  const Camera = CameraHandler(
    { height: canvas.height, width: canvas.width },
    { initalOffset: LevelParams.newScreenOffset }
  );

  /*
    { initalOffset: { x: -210 / 2, y: -144 / 2 }, zoomEnalbed: true }
     this particular offset value will be used when loading a new map while the 
     player's zoomEnabled == true to combat the offset caused by zooming before positioning
     player sprite on the screen.
     */
  const { updateOffset, toggleZoom, updateLastClickPosition } = Camera;
  const { offset } = Camera.cameraState;

  const Player = SpriteCharacter({
    collisions: Collisions,
    ctx: ctx,
    stats: {
      health: 100,
      strength: 25,
    },
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
    source: {
      frames: { min: 0, max: 3 },
      height: 48,
      width: 96,
      img: {
        // left: playerPicL,
        right: playerPicR,
      },
    },
    // isMoving: Control.checkIfPlayerMoving
  });

  const Control = KeybindHandler({
    animate,
    keypressActions: {
      toggleZoom: toggleZoom,
      updateLastClickPosition: updateLastClickPosition,
      updateOffset: updateOffset,
    },
    player: Player,
    Collisions,
  });
  const MapTiles = BuildMapSprite(
    {
      ctx,
      mapData: mapData.mapString,
      offset: mapData.initalOffset,
      spriteSheet: sheet,
      tileSize: 32,
      debug: false,
    },
    Collisions.appendCollidable
  );

  const Entities = BuildGameEntities(
    {
      collisions: Collisions,
      ctx: ctx,
      offset: offset(),
      attack: {
        width: 150,
        height: 12,
      },
      source: {
        frames: { min: 0, max: 5 },
        height: 32,
        width: 160,
        img: monsterPic,
      },
    },
    mapData
  );
  console.log(Entities);
  return { Collisions, Control, Camera, MapTiles, Player, Entities };
}
export default State;
