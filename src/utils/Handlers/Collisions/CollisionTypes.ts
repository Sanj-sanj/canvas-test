import { Rect, Vector } from "../../../Objects/SpriteTypes";
import { TeleportData, Teleports } from "../../MapData/MapAndEntityData";
import { TileCollisionTypes } from "../../MapData/MapDefinitions";
import { MovementKey } from "../Keybinds/KeybindingsTypes";

export type CollisionState = {
  log: () => void;
  setNewMapOffset: (newPos: Vector) => void;
  appendCollidable: (
    { x, y }: Vector,
    collisionData: TileCollisionTypes
  ) => void;
  appendTeleport: (...teleport: Teleports) => void;
  checkForCollisionMovement: (
    spritePos: Vector,
    speed: number,
    direction: MovementKey
  ) => boolean;
  checkForCollisionSprite: (
    rect0: { x: number; y: number; width: number; height: number },
    rect1: { x: number; y: number; width: number; height: number }
  ) => boolean;
  checkForCollisionProjectile: (spriteRect: Rect, offset: Vector) => boolean;
  checkForCollisionTeleport: (
    playerRect: Rect,
    offset: Vector
  ) => TeleportData | undefined;
  getRandomWalkableTile: () => Vector;
  getNewMapOffset: () => Vector;
};
