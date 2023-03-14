import { Rect, Vector } from "../../../Objects/SpriteTypes";
import { MapNames, Teleports } from "../../MapStrings";
import { MovementKey } from "../Keybinds/KeybindingsTypes";

type teleportCollisionData = {
  initial: Vector;
  destination: Vector;
  newMapName: MapNames;
};

export type CollisionState = {
  log: () => void;
  appendCollidable: (
    { x, y }: Vector,
    depthLayer: { walkable: boolean; collidable: boolean }
  ) => void;
  appendTeleport: (teleport: teleportCollisionData) => void;
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
  ) => teleportCollisionData | undefined;
  getRandomWalkableTile: () => Vector;
};
