type CharacterSpriteParams = {
  type: "character";
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
  type: "entity";
  position: { x: number; y: number };
  stats: {
    health: number;
    damage: number;
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
  type: "mapSpriteSheet";
  position: { x: number; y: number };
  source: {
    spriteSize: 32;
    img: HTMLImageElement;
    width: number;
    height: number;
    metadata: {
      type: string;
      spritePath: Vector;
      actors: [];
    };
  };
  ctx: CanvasRenderingContext2D;
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
