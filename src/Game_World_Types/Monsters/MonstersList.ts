import blueMonImage from "../../Assets/monsprite.png";
import { EntitySpriteParams, Stats } from "../../Objects/SpriteTypes";

const blueMon = new Image();
blueMon.src = blueMonImage;

type EntitySpritePartial = Pick<
  EntitySpriteParams,
  "modifiers" | "source" | "interactivity"
>;

export const MonsterTileList = ["m", "M"];

export type MonsterTiles = "m" | "M";
type MonsterChart<T extends string> = {
  [key in T]: {
    tile: key;
    entitySpritePartial: EntitySpritePartial;
  };
};
function genStats(): Stats {
  return {
    health: 100,
    durability: 5,
    dexterity: 2,
    magic: 1,
    speed: 2,
    strength: 5,
  };
}
const MonsterLegend: MonsterChart<MonsterTiles> = {
  m: {
    tile: "m",
    entitySpritePartial: {
      modifiers: {
        attack: {
          primary: { damage: 1, height: 12, width: 150 },
          secondary: { damage: 1, height: 12, width: 12 },
        },
        defense: {
          magic_durability: 4,
          physical_durability: 1,
        },
      },
      source: {
        img: { down: blueMon },
        frames: { min: 1, max: 5 },
        height: 32,
        width: 168,
      },
    },
  },
  M: {
    tile: "M",
    entitySpritePartial: {
      modifiers: {
        attack: {
          primary: { damage: 1, height: 12, width: 150 },
          secondary: { damage: 1, height: 12, width: 12 },
        },
        defense: {
          magic_durability: 4,
          physical_durability: 1,
        },
      },
      source: {
        img: { down: blueMon },
        frames: { min: 1, max: 5 },
        height: 32,
        width: 168,
      },
      interactivity: {
        dialogue: [
          "wow! You found me! I'm the elusive and rare npc with dialogue!",
          "Is that just not amazing?!",
          "I do literally nothing else but provide words lmao",
        ],
      },
    },
  },
};

function getMonster(tile: MonsterTiles) {
  const monster = MonsterLegend[tile];
  const params = monster.entitySpritePartial as Partial<EntitySpriteParams>;
  params.stats = genStats();

  return params;
}
export default getMonster;
