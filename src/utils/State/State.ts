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
  const { offset } = Camera.CameraState;
  const { updateOffset, toggleZoom, updateLastClickPosition } = Camera;

  // our plyer's center position relative to the screen size will be by the formula:
  // [canvas.width | canvas.height] / 2 { / scaling } { - SPRITE SIZE / 2 for x})
  const currPlayerPostion = {
    x: Math.floor(canvas.width / 2 - 16),
    y: Math.floor(canvas.height / 2),
  };
  const Player = SpriteCharacter({
    collisions: Collisions,
    position: currPlayerPostion,
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
      offset,
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
