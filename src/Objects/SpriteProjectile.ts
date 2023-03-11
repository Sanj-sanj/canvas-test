import { ProjectileTypeSprite, Vector } from "./SpriteTypes";

function SpriteProjectile(
  ctx: CanvasRenderingContext2D,
  secondaryAtt: { width: number; height: number }
): ProjectileTypeSprite {
  let iOffset: Vector;
  let currOffset: Vector = { x: 0, y: 0 };
  const attPhysiscs = {
    currX: 0,
    currY: 0,
    clickX: 0,
    clickY: 0,
    baseSpeed: 3,
    duration: {
      current: 90,
      total: 180,
    },
  };

  function setValues(
    start: Vector,
    destination: Vector,
    initialOffset: Vector
  ) {
    //initial offset should be a shallow copy to freeze values
    iOffset = initialOffset;
    attPhysiscs.clickX = destination.x;
    attPhysiscs.clickY = destination.y;
    attPhysiscs.currX = start.x;
    attPhysiscs.currY = start.y;
  }

  function moveProjectile() {
    const distX = attPhysiscs.clickX - (attPhysiscs.currX + 16),
      distY = attPhysiscs.clickY - (attPhysiscs.currY + 16);
    attPhysiscs.currX +=
      (distX / attPhysiscs.duration.current) * attPhysiscs.baseSpeed;
    attPhysiscs.currY +=
      (distY / attPhysiscs.duration.current) * attPhysiscs.baseSpeed;
  }

  function endAnimation() {
    attPhysiscs.duration.current = 0;
  }

  function draw(offset: Vector) {
    if (attPhysiscs.duration.current >= 1) {
      currOffset = {
        x: iOffset.x - offset.x,
        y: iOffset.y - offset.y,
      };
      ctx.fillStyle = "purple";
      ctx.fillRect(
        attPhysiscs.currX + 8 - currOffset.x,
        attPhysiscs.currY + 8 - currOffset.y,
        secondaryAtt.width,
        secondaryAtt.height
      );
      moveProjectile();
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        attPhysiscs.clickX - 8 - currOffset.x,
        attPhysiscs.clickY - 8 - currOffset.y,
        secondaryAtt.width,
        secondaryAtt.height
      );
      attPhysiscs.duration.current--;
      return true;
    }
    return false;
  }

  function getRect() {
    return {
      x: attPhysiscs.currX + 8 - currOffset.x,
      y: attPhysiscs.currY + 8 - currOffset.y,
      width: secondaryAtt.width,
      height: secondaryAtt.height,
    };
  }
  return { draw, setValues, getRect, endAnimation };
}
export default SpriteProjectile;
