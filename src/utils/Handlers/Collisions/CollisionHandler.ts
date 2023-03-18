import { Rect, Vector } from "../../../Objects/SpriteTypes";
import { CollisionState } from "./CollisionTypes";
import { MovementKey } from "../Keybinds/KeybindingsTypes";
import { TeleportData, Teleports } from "../../MapData/MapAndEntityData";

function CollisionHandler(): CollisionState {
  /* 
  This function will contain all collision state related functions.
  collisions: Vector array of environment related tiles 
  */
  const collisions: {
    unwalkable: Vector[];
    collidable: Vector[];
    walkable: Vector[];
    teleport: TeleportData[];
    playerInital: Vector;
  } = {
    unwalkable: [],
    collidable: [],
    walkable: [],
    teleport: [],
    playerInital: { x: 322, y: 288 },
  };

  function setNewMapOffset(newOffset: Vector) {
    /*
    When loading a new level, the value created here will represent the player's position
     */
    collisions.playerInital = newOffset;
  }

  function appendCollidable(
    { x, y }: Vector,
    depthLayer: { walkable: boolean; collidable: boolean }
  ) {
    if (depthLayer.collidable === true) {
      collisions.collidable.push({ x, y });
    }
    if (depthLayer.walkable === false) {
      collisions.unwalkable.push({ x, y });
    }
    if (depthLayer.walkable === true) {
      collisions.walkable.push({ x, y });
    }
  }
  function appendTeleport(...teleports: Teleports) {
    collisions.teleport.push(...teleports);
  }

  function checkForCollisionMovement(
    spritePos: { x: number; y: number },
    speed: number,
    direction: MovementKey
  ) {
    let topY = spritePos.y,
      topX = spritePos.x;
    if (direction === "up" || direction === "down") {
      direction === "up" ? (topY -= speed) : (topY += speed);
    }
    if (direction === "left" || direction === "right") {
      direction === "left" ? (topX -= speed) : (topX += speed);
    }
    //takes coord start of {x, y}then adds the width of the sprite, subtracting the speed of char / 2 to handle collision
    //hard code 30 for sprite width to fit into 1x1 tiles
    return collisions.unwalkable.some(({ x, y }) => {
      return (
        topX + 32 - speed / 2 >= x &&
        topX <= x + 32 - speed / 2 &&
        topY <= y + 32 - speed / 2 &&
        topY + 32 - speed / 2 >= y
      );
    });
  }

  function checkForCollisionTeleport(playerRect: Rect, offset: Vector) {
    return collisions.teleport.find((tile) => {
      return (
        playerRect.x + playerRect.width - 8 >= tile.collision.x + offset.x &&
        playerRect.x <= tile.collision.x + 8 + offset.x &&
        playerRect.y <= tile.collision.y + 8 + offset.y &&
        playerRect.y + playerRect.width - 8 >= tile.collision.y + offset.y
      );
    });
  }

  function checkForCollisionProjectile(rect: Rect, offset: Vector) {
    return collisions.collidable.some(({ x, y }) => {
      return (
        rect.x + rect.width >= x + offset.x &&
        rect.x <= x + offset.x + 32 &&
        rect.y <= y + offset.y + 32 &&
        rect.y + rect.height >= y + offset.y
      );
    });
  }
  function checkForCollisionSprite(rect0: Rect, rect1: Rect) {
    return (
      rect0.x + rect0.width >= rect1.x &&
      rect0.x <= rect1.x + rect1.width &&
      rect0.y <= rect1.y + rect1.height &&
      rect0.y + rect0.width >= rect1.y
    );
  }

  function getRandomWalkableTile() {
    return collisions.walkable[
      Math.floor(Math.random() * collisions.walkable.length)
    ];
  }
  function getNewMapOffset() {
    return collisions.playerInital;
  }
  function log() {
    console.log(collisions);
  }
  return {
    appendCollidable,
    appendTeleport,
    setNewMapOffset,
    log,
    checkForCollisionTeleport,
    checkForCollisionMovement,
    checkForCollisionSprite,
    checkForCollisionProjectile,
    getRandomWalkableTile,
    getNewMapOffset,
  };
}
export default CollisionHandler;
