import {
  ProjectileTypeSprite,
  MapTypeSprite,
  EntityTypeSprite,
  Vector,
} from "../../Objects/SpriteTypes";
import SpriteProjectile from "../../Objects/SpriteProjectile";
import spriteSheet from "../../Assets/sprites.png";

import State from "./State";
import { MapNames } from "../MapStrings";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const sheet = new Image();
sheet.src = spriteSheet;

type LevelParams = {
  mapName: "startingPoint" | "smallTown";
  lastScreenOffset: Vector;
  newScreenOffset: Vector; // provided by the lastScreenOffset tile to have unique transportation [Map1 tile 1 => map2 tile 2  | Map1 tile 5 => Map 2 tile 15 ]
};

function LevelBuilder(level?: LevelParams) {
  const levelData = level || {
    mapName: "startingPoint",
    lastScreenOffset: { x: 0, y: 0 },
    newScreenOffset: { x: 0, y: 0 },
  };
  const { Camera, Control, Collisions, Player, MapTiles, Entities } = State(
    canvas,
    ctx,
    animate,
    levelData
  );
  const { cameraState, updateRenderingProjectiles } = Camera;

  const SpriteState = {
    monsters: [...Entities] as EntityTypeSprite[],
    projectiles: [] as ProjectileTypeSprite[],
    removedSprites: [] as (EntityTypeSprite | null)[],
    background: [...MapTiles] as MapTypeSprite[],
    // TeleportTiles => takes you to new map by recalling level builder with new state values
  };
  let { monsters, removedSprites, projectiles, background } = SpriteState; //eslint-disable-line

  function changeLevel(level: {
    initial: Vector;
    destination: Vector;
    newMapName: MapNames;
  }) {
    console.log(level);
    const newlvl = LevelBuilder({
      lastScreenOffset: cameraState.offset(),
      mapName: level.newMapName,
      newScreenOffset: {
        x: level.destination.x * 16,
        y: level.destination.y * 16,
      },
    });
    return newlvl.animate();
  }

  function animate() {
    if (Control.isKeyPressed("pause", "aux")) return;
    ctx.scale(cameraState.scale(), cameraState.scale());
    const frame = window.requestAnimationFrame(animate);
    // this canvas edit fills everything in black before redrawing other sprites
    // needed when zooming in and out, otherwise artefacts of previous renders exist outside of drawn sprite boundaries.
    ctx.fillStyle = "black";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    background.forEach((tile) => {
      tile.updateOffset(cameraState.offset());
      tile.draw();
    });
    monsters.forEach((monster) => {
      monster.updateOffset(cameraState.offset());
      monster.draw();
    });
    Player.draw(cameraState.screenCenter(), Control.checkIfPlayerMoving());

    const deleteEntitysIndex: number[] = [];

    if (Control.isKeyPressed("secondaryAttack", "aux")) {
      updateRenderingProjectiles(true);
      const newProjectile = SpriteProjectile(ctx, { width: 16, height: 16 });
      newProjectile.setValues(
        cameraState.screenCenter(),
        cameraState.lastClickedPosition(),
        {
          ...cameraState.offset(),
        }
      );
      projectiles.push(newProjectile);
    }
    if (cameraState.renderingProjectiles()) {
      const animationOngoing = projectiles.filter((projectile) => {
        const hasHitWall = Collisions.checkForCollisionProjectile(
          projectile.getRect(),
          cameraState.offset()
        );
        if (hasHitWall) projectile.endAnimation();
        monsters.forEach((monster, i) => {
          const hasHitMon = Collisions.checkForCollisionSprite(
            projectile.getRect(),
            monster.getRect()
          );
          const { finishingBlow } = Player.secondaryAttack(monster, hasHitMon);
          if (hasHitMon) {
            projectile.endAnimation();
            if (finishingBlow) {
              deleteEntitysIndex.push(i);
              monster.killThisSprite();
            }
          }
        });
        return projectile.draw(cameraState.offset());
      });

      projectiles = animationOngoing;
      if (!projectiles.length) updateRenderingProjectiles(false);
    }

    if (Control.isKeyPressed("attack", "aux")) {
      if (monsters.length) {
        monsters.forEach((monster, i) => {
          const finishingBlow = Player.attack(monster);
          if (finishingBlow) {
            deleteEntitysIndex.push(i);
            monster.killThisSprite();
          }
        });
      } else Player.attack();
    }
    if (deleteEntitysIndex.length) {
      /* temp array shallow copy
    delete monster's whichby index to unaffect unrelated
    monsters on the same game tick.
    */
      const tempMon: (EntityTypeSprite | null)[] = [...monsters];
      const deleted: (EntityTypeSprite | null)[] = [];
      deleteEntitysIndex.forEach((n) => {
        deleted.push(tempMon[n]);
        tempMon[n] = null;
      });
      setTimeout(() => {
        monsters = tempMon.filter((m) => m !== null) as EntityTypeSprite[];
        removedSprites = [...removedSprites, ...deleted];
      }, 300);
    }
    const tempPCoords = {
      x: cameraState.screenCenter().x - cameraState.offset().x,
      y: cameraState.screenCenter().y - cameraState.offset().y,
    };

    Control.keypressEventEmitter(tempPCoords, 4);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (Control.checkIfPlayerMoving()) {
      const nextLevel = Collisions.checkForCollisionTeleport(
        Player.getRect(),
        cameraState.offset()
      );
      console.log(
        Collisions.checkForCollisionTeleport(
          Player.getRect(),
          cameraState.offset()
        )
      );
      if (nextLevel) {
        window.cancelAnimationFrame(frame);
        changeLevel(nextLevel);
        // return;
      }
    }
  }
  Control.initControls();
  return { animate };
}

export default LevelBuilder;
