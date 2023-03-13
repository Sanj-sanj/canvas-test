import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
import { MovementKey } from "../utils/Handlers/Keybinds/KeybindingsTypes";

type CharacterSpriteParams = {
  collisions: CollisionState;
  stats: {
    health: number;
    strength: number;
  };
  attack: {
    primary: {
      width: number;
      height: number;
      damage: number;
    };
    secondary: {
      width: number;
      height: number;
      damage: number;
    };
  };
  source: {
    img: {
      right: HTMLImageElement;
      left: HTMLImageElement;
    };
    width: number;
    height: number;
    frames: { min: number; max: number };
  };
  ctx: CanvasRenderingContext2D;
};

type EntitySpriteParams = {
  collisions: CollisionState;
  position: { x: number; y: number };
  stats: {
    health: number;
    damage: number;
    speed: number;
  };
  attack: {
    width: number;
    height: number;
  };
  source: {
    img: HTMLImageElement;
    width: number;
    height: number;
    frames: { min: number; max: number };
  };
  ctx: CanvasRenderingContext2D;
};

export type EntityTypeSprite = {
  draw: () => void;
  log: (offset?: Vector) => void;
  getRect: () => Rect;
  updateOffset: (offset: Vector) => void;
  moveSprite: ({ x, y }: Vector, direction: MovementKey) => void;
  alterHp: (damage: number, modifier: "+" | "-") => number | undefined;
  killThisSprite: () => void;
};

type EnvironmentSpriteSheetParams = {
  position: { x: number; y: number };
  source: {
    spriteSize: 32;
    img: HTMLImageElement;
    width: number;
    height: number;
    metadata: {
      depth: { walkable: boolean; collidable: boolean };
      spritePath: Vector;
      actors: [];
    };
  };
  ctx: CanvasRenderingContext2D;
  debug: boolean;
};

export type MapTypeSprite = {
  buildCollisionData: (
    position: Vector,
    appendCollidable: (
      arg: Vector,
      depthLayer: { walkable: boolean; collidable: boolean }
    ) => void
  ) => void;
  log: (offset?: Vector) => void;
  draw: () => void;
  updateOffset: (newOffset: Vector) => void;
};

type ProjectileTypeSprite = {
  setValues: (
    start: Vector,
    destination: Vector,
    initialOffset: Vector
  ) => void;
  draw: (offset: Vector) => boolean;
  getRect: () => Rect;
  endAnimation: () => void;
};
type Vector = { x: number; y: number };
type Rect = { x: number; y: number; width: number; height: number };

type SpriteParams = EntitySpriteParams | EnvironmentSpriteSheetParams;

export type {
  CharacterSpriteParams,
  EntitySpriteParams,
  EnvironmentSpriteSheetParams,
  ProjectileTypeSprite,
  Vector,
  Rect,
  SpriteParams,
};
