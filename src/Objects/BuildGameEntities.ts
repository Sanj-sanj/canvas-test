import SpriteEntity from "./SpriteEntity";
import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
import { CharacterSpriteParams, EntityTypeSprite } from "./SpriteTypes";
import {
  EntityTile,
  MapData,
  TeleportData,
  TeleportTileMarker,
} from "../utils/MapData/MapAndEntityData";
import SpriteCharacter, { CharacterTypeSprite } from "./SpriteCharacter";

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
  MapData: MapData,
  playerData: CharacterSpriteParams,
  newLevel?: TeleportData
) {
  const results = {
    entities: [] as EntityTypeSprite[],
    player: {} as CharacterTypeSprite,
  };
  results.player = SpriteCharacter(playerData);
  MapData.entityString
    .trim()
    .split("\n")
    .forEach((row, y) => {
      row.split("").map((tile, x) => {
        const thisTile = tile as EntityTile;
        const thispos = {
          x: x * 32,
          y: y * 32,
        };

        if (newLevel && thisTile === newLevel.meta.destination) {
          /* 
           IF LOADING A NEW LEVEL:
           update Collisions's "playerInital" Vector.
           this new value is used after building state to reset the 
           camera to this specific position. becaus this is the destination from a teleport.
          */
          entityChart.collisions.setNewMapOffset({
            x: thispos.x - newLevel.meta.destinationOffset.x * 32,
            y: thispos.y - newLevel.meta.destinationOffset.y * 32,
          });
        }
        // MONSTER ENTITY LOGIC
        if (thisTile === "m") {
          const stats = genStats();
          results.entities.push(
            SpriteEntity({
              ...entityChart,
              position: { x: thispos.x, y: thispos.y },
              stats,
            })
          );
        }
        //TELEPORT TILE LOGIC
        if (
          !Number.isNaN(+thisTile) &&
          MapData.validTeleportTiles.includes(thisTile as TeleportTileMarker)
        ) {
          const teleports = MapData.teleportData[+thisTile];
          const teleportD = {
            ...teleports,
            collision: {
              x: x * 32,
              y: y * 32,
            },
          };
          entityChart.collisions.appendTeleport(teleportD);
        }
      });
    });
  // }
  return results;
}
export default BuildGameEntities;
