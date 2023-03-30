import { MovementKey } from "../../utils/Handlers/Keybinds/KeybindingsTypes";
import { CharacterSpriteParams } from "../SpriteTypes";

const PlayerParams: Pick<
  CharacterSpriteParams,
  "stats" | "modifiers" | "initialFacingDirection"
> = {
  stats: {
    health: 100,
    strength: 25,
    dexterity: 10,
    durability: 12,
    magic: 26,
    speed: 4,
  },
  modifiers: {
    attack: {
      primary: {
        width: 32,
        height: 32,
        damage: 25,
      },
      secondary: {
        width: 16,
        height: 16,
        damage: 10,
      },
    },
    defense: {
      magic_durability: 20,
      physical_durability: 20,
    },
  },
  initialFacingDirection: "down",
};

export { PlayerParams };
