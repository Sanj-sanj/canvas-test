import { Rect, Vector } from "../../../Objects/SpriteTypes";
import { MovementKey } from "../Keybinds/KeybindingsTypes";

export type CollisionState = {
  log: () => void;
  appendCollidable: (
    { x, y }: Vector,
    depthLayer: { walkable: boolean; collidable: boolean }
  ) => void;
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
};
