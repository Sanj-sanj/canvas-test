import {
  ProjectileTypeSprite,
  MapTypeSprite,
  EntityTypeSprite,
} from "../../Objects/SpriteTypes";
import SpriteProjectile from "../../Objects/SpriteProjectile";
import spriteSheet from "../../Assets/sprites.png";

import State from "./State";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const sheet = new Image();
sheet.src = spriteSheet;

function LevelBuilder() {
  const { Camera, Control, Player, MapTiles, TestMonsters } = State(
    canvas,
    ctx,
    animate
  );
  const { getScale, getScreenCenter, getLastClickPosition, CameraState } =
    Camera;
  const { offset } = CameraState;

  const projectileState = {
    renderingProjectile: false,
    projectiles: [] as ProjectileTypeSprite[],
  };
  const SpriteState = {
    monsters: [...TestMonsters] as EntityTypeSprite[],
    projectiles: [] as ProjectileTypeSprite[],
    removedSprites: [] as (EntityTypeSprite | null)[],
  };
  const moveables: MapTypeSprite[] = [...MapTiles];
  let { monsters, removedSprites } = SpriteState;
  let { renderingProjectile, projectiles } = projectileState;

  function animate() {
    if (Control.isKeyPressed("pause", "aux")) return;
    ctx.scale(getScale(), getScale());
    window.requestAnimationFrame(animate);
    // this canvas edit fills everything in black before redrawing other sprites
    // needed when zooming in and out, otherwise artefacts of previous renders exist outside of drawn sprite boundaries.
    ctx.fillStyle = "black";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    moveables.forEach((moveable) => {
      moveable.updateOffset(offset);
      moveable.draw();
    });
    monsters.forEach((mon) => {
      mon.updateOffset(offset);
      mon.draw();
    });
    Player.draw(getScreenCenter());

    const deleteEntitysIndex: number[] = [];

    if (Control.isKeyPressed("secondaryAttack", "aux")) {
      renderingProjectile = true;
      const newProjectile = SpriteProjectile(ctx, { width: 16, height: 16 });
      newProjectile.setValues(getScreenCenter(), getLastClickPosition(), {
        ...offset,
      });
      projectiles.push(newProjectile);
    }
    if (renderingProjectile) {
      const animationOngoing = projectiles.filter((projectile) => {
        monsters.forEach((monster, i) => {
          const { finishingBlow, isHit, hitWall } = Player.secondaryAttack(
            monster,
            projectile.getRect(),
            offset
          );
          if (hitWall) projectile.endAnimation();
          if (isHit) {
            projectile.endAnimation();
            if (finishingBlow) {
              // removedSprites = [...removedSprites, monster];
              deleteEntitysIndex.push(i);
              monster.killThisSprite();
            }
          }
        });
        return projectile.draw(offset);
      });
      projectiles = animationOngoing;
      if (!projectiles.length) renderingProjectile = false;
    }

    if (Control.isKeyPressed("attack", "aux")) {
      if (monsters.length) {
        monsters.forEach((monster, i) => {
          const finishingBlow = Player.attack(monster);
          if (finishingBlow) {
            // removedSprites = [...removedSprites, monster];
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
      x: getScreenCenter().x - offset.x,
      y: getScreenCenter().y - offset.y,
    };

    Control.keypressEventEmitter(tempPCoords, 4);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  Control.initControls();
  return { animate };
}

export default LevelBuilder;
