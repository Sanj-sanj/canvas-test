import { Vector } from "../../Objects/SpriteTypes";
import { LevelParams } from "../State/LevelBuilder";
import selectMap from "./Maps";
export type MapNames = "startingPoint" | "smallTown" | "startingPointBasement";

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
type MonsterTiles = "m";
export type EntityMarker = BlankTile | MonsterTiles | TeleportTileMarker;

export type TeleportData = {
  comingFrom: MapNames;
  destinationName: MapNames;
  initial: TeleportTileMarker;
  meta: {
    newMapName: MapNames;
    destination: TeleportTileMarker;
    destinationOffset: Vector;
  };
  collision: {
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
  teleportData: Teleports;
  zoomEnabled: boolean;
};

function createMapAndEntityMetaData({
  mapName,
  zoomEnabled,
}: LevelParams): MapData {
  const { mapString, entityString } = selectMap(mapName);
  const maps: { [key in MapNames]: MapData } = {
    startingPoint: {
      validTeleportTiles: ["1", "0", "2"],
      mapName: "startingPoint",
      mapString,
      entityString,
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "0",
            newMapName: "smallTown",
            destinationOffset: { x: 0, y: 1 },
          },
          comingFrom: "startingPoint",
          destinationName: "smallTown",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "1",
          meta: {
            destination: "0",
            newMapName: "smallTown",
            destinationOffset: { x: 0, y: 1 },
          },
          comingFrom: "startingPoint",
          destinationName: "smallTown",
          collision: {
            x: 0,
            y: 0,
          },
        },
        {
          initial: "2",
          meta: {
            destination: "0",
            newMapName: "startingPointBasement",
            destinationOffset: { x: 0, y: 1 },
          },
          comingFrom: "startingPoint",
          destinationName: "startingPointBasement",
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
      mapString,
      entityString,
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "0",
            newMapName: "startingPoint",
            destinationOffset: { x: 0, y: -1 },
          },
          comingFrom: "smallTown",
          destinationName: "startingPoint",
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
      mapString,
      entityString,
      teleportData: [
        {
          initial: "0",
          meta: {
            destination: "2",
            newMapName: "startingPoint",
            destinationOffset: { x: 0, y: 1 },
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
  };
  const selection = maps[mapName];
  return selection;
}

export default createMapAndEntityMetaData;
