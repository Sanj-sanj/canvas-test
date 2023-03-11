import SpriteEntity from "./SpriteEntity";
import monImg from "../Assets/monsprite.png";
import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";

const ctx = document
  .querySelector("canvas")
  ?.getContext("2d") as CanvasRenderingContext2D;

const monsterPic = new Image();
monsterPic.src = monImg;

function buildTestMons(collisions: CollisionState) {
  const monster1 = SpriteEntity({
    collisions,
    position: { x: 402, y: 450 },
    ctx: ctx,
    stats: {
      health: 100,
      damage: 5,
      speed: 2,
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
    collisions,
    position: { x: 368, y: 650 },
    ctx: ctx,
    stats: {
      health: 100,
      damage: 5,
      speed: 2,
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
    collisions,
    position: { x: 368, y: 450 },
    ctx: ctx,
    stats: {
      health: 100,
      damage: 5,
      speed: 2,
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
    collisions,
    position: { x: 442, y: 250 },
    ctx: ctx,
    stats: {
      health: 100,
      damage: 5,
      speed: 2,
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
    collisions,
    position: { x: 398, y: 560 },
    ctx: ctx,
    stats: {
      health: 100,
      damage: 5,
      speed: 2,
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
    collisions,
    position: { x: 398, y: 530 },
    ctx: ctx,
    stats: {
      health: 100,
      damage: 5,
      speed: 2,
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
  const testMons = [monster1, monster2, monster3, monster4, monster5, monster6];
  return testMons;
}
export default buildTestMons;
