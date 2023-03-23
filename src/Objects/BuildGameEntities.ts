import SpriteEntity from "./SpriteEntity";
import { CollisionState } from "../utils/Handlers/Collisions/CollisionTypes";
import {
  CharacterSpriteParams,
  EntitySpriteParams,
  EntityTypeSprite,
} from "./SpriteTypes";
import {
  EntityTile,
  MapData,
  TeleportData,
  TeleportTileMarker,
} from "../utils/MapData/MapAndEntityData";
import SpriteCharacter, { CharacterTypeSprite } from "./SpriteCharacter";
import getMonster, {
  MonsterTileList,
  MonsterTiles,
} from "../Game_World_Types/Monsters/MonstersList";

function BuildGameEntities(
  ctx: CanvasRenderingContext2D,
  collisions: CollisionState,
  MapData: MapData,
  playerData: Pick<CharacterSpriteParams, "modifiers" | "source" | "stats">,
  newLevel?: TeleportData
) {
  const sprites = {
    entities: [] as EntityTypeSprite[],
    player: {} as CharacterTypeSprite,
  };

  sprites.player = SpriteCharacter({ ...playerData, ctx }, collisions);
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
          collisions.setNewMapOffset({
            x: thispos.x - newLevel.meta.destinationOffset.x * 32,
            y: thispos.y - newLevel.meta.destinationOffset.y * 32,
          });
        }
        // MONSTER ENTITY LOGIC

        const isMonTile = (tile: EntityTile): tile is MonsterTiles =>
          MonsterTileList.includes(tile);

        if (isMonTile(thisTile)) {
          const partialMonster = getMonster(thisTile);
          if (partialMonster) {
            const monster = {
              ...partialMonster,
              ctx,
              position: thispos,
            } as EntitySpriteParams;
            sprites.entities.push(SpriteEntity(monster, collisions));
            if (partialMonster.interactivity)
              collisions.appendDialogue({
                text: partialMonster.interactivity?.dialogue,
                position: thispos,
              });
          }
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
          collisions.appendTeleport(teleportD);
        }
      });
    });
  return sprites;
}
export default BuildGameEntities;
