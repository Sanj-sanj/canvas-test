import SpriteEntity from "./SpriteEntity";
import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
import { EntityTypeSprite } from "./SpriteTypes";

function genStats() {
  return { health: 100, damage: 5, speed: 2 };
  // attack: { width: 150, height: 12 },
}
function BuildGameEntities(
  entityChart: {
    attack: { width: number; height: number };
    collisions: CollisionState;
    ctx: CanvasRenderingContext2D;
    source: {
      frames: { min: number; max: number };
      height: number;
      width: number;
      img: HTMLImageElement;
    };
  },

  quantity: number
) {
  const entities: EntityTypeSprite[] = [];
  for (let i = 0; i < quantity; i++) {
    const { x, y } = entityChart.collisions.getRandomWalkableTile();
    const stats = genStats();
    entities.push(SpriteEntity({ ...entityChart, position: { x, y }, stats }));
  }
  return entities;
}
export default BuildGameEntities;
