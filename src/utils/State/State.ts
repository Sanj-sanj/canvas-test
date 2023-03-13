import BuildMapSprite from "../../BuildMapSprites";
import buildTestMons from "../../Objects/GameEntitys";
import SpriteCharacter from "../../Objects/SpriteCharacter";
import { Map1 } from "../MapStrings";
import spriteSheet from "../../Assets/sprites.png";
import mageLeft from "../../Assets/mageLeft.png";
import mageRight from "../../Assets/mageRight.png";
import CameraHandler from "../Handlers/Camera/CameraHandler";
import CollisionHandler from "../Handlers/Collisions/CollisionHandler";
import KeybindHandler from "../Handlers/Keybinds/KeybindHandler";

const sheet = new Image();
sheet.src = spriteSheet;
const playerPicR = new Image();
const playerPicL = new Image();
playerPicR.src = mageRight;
playerPicL.src = mageLeft;

function State(
  canvas: { height: number; width: number },
  ctx: CanvasRenderingContext2D,
  animate: () => void
) {
  const Collisions = CollisionHandler();
  const Camera = CameraHandler({ height: canvas.height, width: canvas.width });
  /*
    { initalOffset: { x: -210 / 2, y: -144 / 2 }, zoomEnalbed: true }
     this particular offset value will be used when loading a new map while the 
     player's zoomEnabled == true to combat the offset caused by zooming before positioning
     player sprite on the screen.
     */
  const { offset } = Camera.cameraState;
  const { updateOffset, toggleZoom, updateLastClickPosition } = Camera;

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
      frames: { min: 0, max: 1 },
      height: 32,
      width: 32,
      img: {
        left: playerPicL,
        right: playerPicR,
      },
    },
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
      mapString: Map1,
      offset: offset(),
      spriteSheet: sheet,
      tileSize: 32,
      debug: false,
    },
    Collisions.appendCollidable
  );
  const TestMonsters = buildTestMons(Collisions);
  return { Collisions, Control, Camera, MapTiles, Player, TestMonsters };
}
export default State;
