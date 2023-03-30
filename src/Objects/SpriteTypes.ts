import { MovementKey } from "../utils/Handlers/Keybinds/KeybindingsTypes";
import { TileCollisionTypes } from "../utils/MapData/MapDefinitions";

/**
 * Character stats and attack types
 */
export type Sprite_Source = {
  img: {
    right: HTMLImageElement;
    left: HTMLImageElement;
    down: HTMLImageElement;
    up: HTMLImageElement;
  };
  width: number;
  height: number;
  frames: { min: number; max: number };
};
export type Stats = {
  health: number;
  strength: number;
  magic: number;
  dexterity: number;
  speed: number;
  durability: number;
};
export interface Stat_Modifiers {
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
  defense: {
    physical_durability: number;
    magic_durability: number;
  };
}

type CharacterSpriteParams = {
  stats: Stats;
  modifiers: Stat_Modifiers;
  source: Sprite_Source;
  initialFacingDirection: MovementKey;
};

type EntitySpriteParams = {
  position: Vector;
  stats: Stats;
  modifiers: Stat_Modifiers;
  source: Sprite_Source;
  ctx: CanvasRenderingContext2D;
  interactivity?: {
    dialogue: string[];
  };
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
      collisionData: TileCollisionTypes;
      spritePath: Vector;
      actors: [];
    };
  };
  ctx: CanvasRenderingContext2D;
  debug: boolean;
};

export type MapTypeSprite = {
  // buildCollisionData: (
  //   position: Vector,
  //   appendCollidable: (arg: Vector, collisionData: TileCollisionTypes) => void
  // ) => void;
  log: (offset?: Vector) => void;
  draw: () => void;
  updateOffset: (newOffset: Vector) => void;
};
export type BuildMapCollisions = (
  arg: Vector,
  collisionData: TileCollisionTypes
) => void;

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
