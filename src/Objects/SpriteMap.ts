import {
  BuildMapCollisions,
  EnvironmentSpriteSheetParams,
  MapTypeSprite,
  Vector,
} from "./SpriteTypes";

function SpriteMap({
  position,
  source,
  ctx,
  debug,
}: EnvironmentSpriteSheetParams): MapTypeSprite {
  const offset = { x: 0, y: 0 };

  function draw() {
    //  "mapSpriteSheet"
    ctx.drawImage(
      source.img,
      source.spriteSize * source.metadata.spritePath.x, // x on sprite sheet
      source.spriteSize * source.metadata.spritePath.y, //y on sprite sheet
      32,
      32,
      position.x + offset.x,
      position.y + offset.y,
      32,
      32
    );
    if (debug && source.metadata.collisionData.stopsProjectiles) {
      ctx.font = "12zpx sans-serif";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeText(
        `x:${position.x + offset.x}`,
        position.x + offset.x,
        position.y + 14 + offset.y,
        32
      );
      ctx.strokeText(
        `y:${position.y + offset.y}`,
        position.x + offset.x,
        position.y + 26 + offset.y,
        32
      );

      ctx.fillStyle = "red";
      ctx.fillText(
        `x:${position.x + offset.x}`,
        position.x + offset.x,
        position.y + 14 + offset.y,
        32
      );
      ctx.fillText(
        `y:${position.y + offset.y}`,
        position.x + offset.x,
        position.y + 26 + offset.y,
        32
      );
    }
  }
  function log(offset?: Vector) {
    console.log({ position, source, offset });
  }
  function buildCollisionData(
    pos: Vector,
    appendCollidable: BuildMapCollisions
  ) {
    appendCollidable(pos, source.metadata.collisionData);
  }

  function updateOffset(offsetNew: Vector) {
    offset.x = offsetNew.x;
    offset.y = offsetNew.y;
  }
  return {
    log,
    draw,
    buildCollisionData,
    updateOffset,
  };
}
export default SpriteMap;
