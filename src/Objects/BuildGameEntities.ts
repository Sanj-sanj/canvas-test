import SpriteEntity from "./SpriteEntity";
import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
import { EntityTypeSprite, Vector } from "./SpriteTypes";
import { MapData } from "../utils/MapStrings";

function genStats() {
  return { health: 100, damage: 5, speed: 2 };
  // attack: { width: 150, height: 12 },
}
function BuildGameEntities(
  entityChart: {
    attack: { width: number; height: number };
    collisions: CollisionState;
    ctx: CanvasRenderingContext2D;
    offset: Vector;
    source: {
      frames: { min: number; max: number };
      height: number;
      width: number;
      img: HTMLImageElement;
    };
  },
  MapData: MapData
) {
  const entities: EntityTypeSprite[] = [];

  MapData.entityString
    .trim()
    .split("\n")
    .forEach((row, y) => {
      row.split("").map((tile, x) => {
        const thispos = {
          x: x * 32 + entityChart.offset.x,
          y: y * 32 + entityChart.offset.y,
        };
        if (tile === "m") {
          const stats = genStats();
          entities.push(
            SpriteEntity({
              ...entityChart,
              position: { x: thispos.x, y: thispos.y },
              stats,
            })
          );
        }
        if (tile === "-") {
          //teleport tile
          const teleport = {
            ...MapData.teleports,
            initial: {
              x: x * 32 + entityChart.offset.x,
              y: y * 32 + entityChart.offset.y,
            },
          };
          entityChart.collisions.appendTeleport(teleport);
          // console.log(teleport);
        }
      });
    });
  // }
  return entities;
}
export default BuildGameEntities;
