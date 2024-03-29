import { MonsterTiles } from "../../Game_World_Types/Monsters/MonstersList";
import { Vector } from "../../Objects/SpriteTypes";
import { LevelParams } from "../State/LevelBuilder";

import selectMap from "./Maps";
export type MapNames =
  | "startingPoint"
  | "startPointNorthPath"
  | "smallTown"
  | "startingPointBasement";

export type TeleportTileMarker =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
type BlankTile = ".";
export type EntityTile = BlankTile | MonsterTiles | TeleportTileMarker;

export type TeleportData = {
  comingFrom: MapNames;
  destinationName: MapNames;
  initial: TeleportTileMarker;
  meta: {
    destination: TeleportTileMarker;
    destinationOffset: Vector;
  };
  collision: {
    // true values are provided on level creation at BuildGameEntities.
    x: number;
    y: number;
  };
};
export type Teleports = TeleportData[];
export type MapData = {
  validTeleportTiles: TeleportTileMarker[];
  mapName: MapNames;
  mapString: string;
  entityString: string;
  foregroundString: string;
  teleportData: Teleports;
  zoomEnabled: boolean;
  dialogues?: string[][];
};

function createMapAndEntityMetaData({
  mapName,
  zoomEnabled,
}: LevelParams): MapData {
  const maps: {
    [key in MapNames]: Pick<
      MapData,
      "mapName" | "teleportData" | "validTeleportTiles" | "zoomEnabled"
    >;
  } = {
    startingPoint: {
      validTeleportTiles: ["0", "1", "2", "3"],
      mapName: "startingPoint",
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "0",
            destinationOffset: { x: 1, y: 0 },
          },
          comingFrom: "startingPoint",
          destinationName: "startPointNorthPath",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "1",
          meta: {
            destination: "1",
            destinationOffset: { x: 1, y: 0 },
          },
          comingFrom: "startingPoint",
          destinationName: "startPointNorthPath",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "2",
          meta: {
            destination: "0",
            destinationOffset: { x: -1, y: 0 },
          },
          comingFrom: "startingPoint",
          destinationName: "startingPointBasement",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "3",
          meta: {
            destination: "3",
            destinationOffset: { x: 0, y: 0 },
          },
          comingFrom: "startingPoint",
          destinationName: "startPointNorthPath",
          collision: {
            x: 0,
            y: 0,
          },
        },
      ],
      zoomEnabled,
    },
    smallTown: {
      validTeleportTiles: ["0"],
      mapName: "smallTown",
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "2",
            destinationOffset: { x: -1, y: 0 },
          },
          comingFrom: "smallTown",
          destinationName: "startPointNorthPath",
          collision: {
            x: 0,
            y: 0,
          },
        },
      ],
      zoomEnabled,
    },
    startingPointBasement: {
      validTeleportTiles: ["0"],
      mapName: "startingPointBasement",
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "2",
            destinationOffset: { x: -1, y: 0 },
          },
          comingFrom: "startingPointBasement",
          destinationName: "startingPoint",
          collision: {
            x: 0,
            y: 0,
          },
        },
      ],
      zoomEnabled,
    },
    startPointNorthPath: {
      validTeleportTiles: ["0", "1", "2"],
      mapName: "startPointNorthPath",
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "0",
            destinationOffset: { x: 0, y: -1 },
          },
          comingFrom: "startPointNorthPath",
          destinationName: "startingPoint",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "1",
          meta: {
            destination: "1",
            destinationOffset: { x: 0, y: -1 },
          },
          comingFrom: "startPointNorthPath",
          destinationName: "startingPoint",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "2",
          meta: {
            destination: "0",
            destinationOffset: { x: 0, y: 1 },
          },
          comingFrom: "startPointNorthPath",
          destinationName: "smallTown",
          collision: {
            x: 0,
            y: 0,
          },
        },
      ],
      zoomEnabled,
    },
  };
  const selection = maps[mapName];
  const { mapString, entityString, foregroundString, dialogues } =
    selectMap(mapName);

  return { ...selection, mapString, entityString, foregroundString, dialogues };
}

export default createMapAndEntityMetaData;
