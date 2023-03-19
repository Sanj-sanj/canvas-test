import LevelBuilder from "./utils/State/LevelBuilder";
("./utils/State/LevelBuilder");
import "./style.css";

const root = document.querySelector<HTMLDivElement>(".app");
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = 864;
canvas.height = 576;

root?.append(canvas);
const { animate } = LevelBuilder({
  mapName: "startingPoint",
  zoomEnabled: false,
});

animate();
