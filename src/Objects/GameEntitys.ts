import { SpriteEntity } from "./Sprite";
import monImg from "../Assets/monsprite.png";
// import spriteSheet from '../Assets/sprites.png'
const ctx = document
  .querySelector("canvas")
  ?.getContext("2d") as CanvasRenderingContext2D;

const monsterPic = new Image();
monsterPic.src = monImg;

// const sheet = new Image();
// sheet.src = spriteSheet;

const monster1 = SpriteEntity({
  position: { x: 468, y: 450 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster2 = SpriteEntity({
  position: { x: 368, y: 650 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster3 = SpriteEntity({
  position: { x: 368, y: 450 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster4 = SpriteEntity({
  position: { x: 442, y: 250 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster5 = SpriteEntity({
  position: { x: 398, y: 560 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
const monster6 = SpriteEntity({
  position: { x: 398, y: 530 },
  ctx: ctx,
  stats: {
    health: 100,
    damage: 5,
  },
  attack: {
    width: 150,
    height: 12,
  },
  source: {
    frames: { min: 0, max: 5 },
    height: 32,
    width: 160,
    img: monsterPic,
  },
});
export const testMons = [
  monster1,
  monster2,
  monster3,
  monster4,
  monster5,
  monster6,
];
