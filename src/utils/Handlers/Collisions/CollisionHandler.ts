import { Rect, Vector } from "../../../Objects/SpriteTypes";
import { CollisionState } from "./CollisionTypes";
import { MovementKey } from "../Keybinds/KeybindingsTypes";
import { MapNames } from "../../MapStrings";

function CollisionHandler(): CollisionState {
  /* 
  This function will contain all collision state related functions.
  collisions: Vector array of environment related tiles 
  */
  const collisions: {
    unwalkable: Vector[];
    collidable: Vector[];
    walkable: Vector[];
    teleport: { newMapName: MapNames; initial: Vector; destination: Vector }[];
  } = {
    unwalkable: [],
    collidable: [],
    walkable: [],
    teleport: [],
  };

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
  function appendTeleport(teleport: {
    initial: Vector;
    destination: Vector;
    newMapName: MapNames;
  }) {
    collisions.teleport.push(teleport);
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
        topX + 30 - speed / 2 >= x &&
        topX <= x + 30 - speed / 2 &&
        topY <= y + 30 - speed / 2 &&
        topY + 30 - speed / 2 >= y
      );
    });
  }

  function checkForCollisionTeleport(playerRect: Rect, offset: Vector) {
    return collisions.teleport.find((t) => {
      return checkForCollisionSprite(
        { width: 32, height: 32, x: playerRect.x, y: playerRect.y },
        {
          x: t.initial.x + offset.x,
          y: t.initial.y + offset.y,
          width: 32,
          height: 32,
        }
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

  function log() {
    console.log(collisions);
  }
  return {
    appendCollidable,
    appendTeleport,
    log,
    checkForCollisionTeleport,
    checkForCollisionMovement,
    checkForCollisionSprite,
    checkForCollisionProjectile,
    getRandomWalkableTile,
  };
}
export default CollisionHandler;
