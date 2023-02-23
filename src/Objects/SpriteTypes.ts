type CharacterSprite = {
  type: "character";
  position: { x: number; y: number };
  stats: {
    health: number;
    damage: number;
  };
  attack: {
    width: number;
    height: number;
    startX: number;
    startY: number;
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

type EntitySprite = {
  type: "entity";
  position: { x: number; y: number };
  stats: {
    health: number;
    damage: number;
  };
  attack: {
    width: number;
    height: number;
    startX: number;
    startY: number;
  };
  source: {
    img: HTMLImageElement;
    width: number;
    height: number;
    frames: { min: number; max: number };
  };
  ctx: CanvasRenderingContext2D;
};

type EnvironmentSpriteSheet = {
  type: "mapSpriteSheet";
  position: { x: number; y: number };
  source: {
    spriteSize: 16 | 32;
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
type Vector = { x: number; y: number };

type SpriteParams = EntitySprite | EnvironmentSpriteSheet;

export type {
  CharacterSprite,
  EntitySprite,
  EnvironmentSpriteSheet,
  Vector,
  SpriteParams,
};
