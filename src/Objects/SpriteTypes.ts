import { CollisionState } from "../Collisions";

type CharacterSpriteParams = {
  position: { x: number; y: number };
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

type ProjectileTypeSprite = {
  setValues: (
    start: Vector,
    destination: Vector,
    initialOffset: Vector
  ) => void;
  draw: (offset: Vector) => boolean;
  getRect: () => { x: number; y: number; width: number; height: number };
  endAnimation: () => void;
};
type Vector = { x: number; y: number };

type SpriteParams = EntitySpriteParams | EnvironmentSpriteSheetParams;

export type {
  CharacterSpriteParams,
  EntitySpriteParams,
  EnvironmentSpriteSheetParams,
  ProjectileTypeSprite,
  Vector,
  SpriteParams,
};
