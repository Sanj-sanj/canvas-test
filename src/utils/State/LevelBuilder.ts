import {
  ProjectileTypeSprite,
  MapTypeSprite,
  EntityTypeSprite,
} from "../../Objects/SpriteTypes";
import SpriteProjectile from "../../Objects/SpriteProjectile";
import spriteSheet from "../../Assets/sprites.png";

import State from "./State";
import { MapNames, TeleportData } from "../MapData/MapAndEntityData";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const sheet = new Image();
sheet.src = spriteSheet;

export type LevelParams = {
  mapName: MapNames;
  zoomEnabled: boolean;
};

function LevelBuilder(level: LevelParams, newLevel?: TeleportData) {
  const levelData = level;
  const {
    Camera,
    Control,
    Collisions,
    MapTiles,
    ForegroundTiles,
    Entities,
    Dialogue,
  } = State(canvas, ctx, animate, levelData, newLevel);
  const Player = Entities.player;
  const { cameraState, updateRenderingProjectiles } = Camera;

  Control.initControls();
  const SpriteState = {
    monsters: [...Entities.entities] as EntityTypeSprite[],
    projectiles: [] as ProjectileTypeSprite[],
    removedSprites: [] as (EntityTypeSprite | null)[],
    background: [...MapTiles] as MapTypeSprite[],
    foreground: [...ForegroundTiles] as MapTypeSprite[],
  };
  // eslint-disable-next-line
  let { monsters, removedSprites, projectiles, background, foreground } =
    SpriteState;

  function changeLevel(level: TeleportData) {
    const newlvl = LevelBuilder(
      {
        mapName: level.destinationName,
        zoomEnabled: cameraState.zoomEnabled(),
      },
      level
    );
    Control.unbindControls();
    newlvl.animate();
  }

  function animate() {
    ctx.scale(cameraState.scale(), cameraState.scale());
    const frame = window.requestAnimationFrame(animate);
    if (Control.isKeyPressed("pause", "aux")) {
      window.cancelAnimationFrame(frame);
      return;
    }
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
    foreground.forEach((tile) => {
      tile.updateOffset(cameraState.offset());
      tile.draw();
    });

    const deleteEntitysIndex: number[] = [];
    if (Dialogue.isDialogueOpen()) {
      Dialogue.writeMessage();
    }
    if (Control.isKeyPressed("interaction", "aux")) {
      if (Dialogue.isDialogueOpen()) {
        Dialogue.increment();
      } else {
        Dialogue.buildMessage([
          "Gold Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the location of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece (which promises an unlimited amount of riches and fame), and quite possibly the most coveted of titles for the person who found it, the title of the Pirate King.",
          "After a disastrous defeat at the 2018 World Cup, Japan's team struggles to regroup. But what's missing? An absolute Ace Striker, who can guide them to the win. The Japan Football Union is hell-bent on creating a striker who hungers for goals and thirsts for victory, and who can be the decisive instrument in turning around a losing match...and to do so, they've gathered 300 of Japan's best and brightest youth players. Who will emerge to lead the team...and will they be able to out-muscle and out-ego everyone who stands in their way? ",
          'With Tomura Shigaraki at its helm, the former Liberation Army is now known as the Paranormal Liberation Front. This organized criminal group poses an immense threat to the Hero Association, not only because of its sheer size and strength, but also the overpowering quirks of Jin "Twice" Bubaigawara and Gigantomachia. ',
        ]);
      }
    }

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

    if (Control.checkIfPlayerMoving()) {
      Control.keypressEventEmitter(tempPCoords, 6);
      Player.changeDirection(Control.getMovingDirection());
      const nextLevel = Collisions.checkForCollisionTeleport(
        Player.getRect(),
        cameraState.offset()
      );
      if (nextLevel) {
        window.cancelAnimationFrame(frame);
        changeLevel(nextLevel);
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  return { animate };
}

export default LevelBuilder;
