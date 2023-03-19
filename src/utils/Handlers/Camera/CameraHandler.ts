import { Vector } from "../../../Objects/SpriteTypes";

function CameraHandler(canvas: { width: number; height: number }) {
  let zoomOn = false;
  let scale = zoomOn ? 2 : 1;
  const offset = { x: 0, y: 0 };
  const lastClickPosition = { x: 0, y: 0 };
  let isReneringPojectiles = false;

  const cameraState = {
    lastClickedPosition: getLastClickPosition,
    screenCenter: getScreenCenter,
    scale: getScale,
    renderingProjectiles: getRenderingProjectiles,
    offset: getOffset,
    zoomEnabled: getZoom,
  };

  function overrideOffset(newPos: Vector) {
    (offset.x = newPos.x), (offset.y = newPos.y);
  }

  function updateRenderingProjectiles(newVal: boolean) {
    isReneringPojectiles = newVal;
  }
  function updateOffset(pos: "x" | "y", operand: "+" | "-", speed = 6) {
    if (operand === "+") {
      offset[pos] += speed;
    }
    if (operand === "-") {
      offset[pos] -= speed;
    }
  }
  function toggleZoom() {
    if (zoomOn === false) {
      updateOffset("y", "-", 28.8 * 5);
      updateOffset("x", "-", 42 * 5);
      scale = 2;
      zoomOn = true;
    } else if (zoomOn === true) {
      updateOffset("y", "+", 28.8 * 5);
      updateOffset("x", "+", 42 * 5);
      scale = 1;
      zoomOn = false;
    }
  }
  function updateLastClickPosition(newPos: Vector) {
    lastClickPosition.x = newPos.x;
    lastClickPosition.y = newPos.y;
  }
  function getRenderingProjectiles(): boolean {
    return isReneringPojectiles;
  }
  function getZoom() {
    return zoomOn;
  }
  function getOffset() {
    return offset;
  }
  function getLastClickPosition(): Vector {
    return {
      x: lastClickPosition.x / scale,
      y: lastClickPosition.y / scale,
    };
  }
  function getScreenCenter(): Vector {
    // our plyer's center position relative to the screen size will be by the formula:
    // [canvas.width | canvas.height] / 2 { / scaling } { - SPRITE SIZE / 2 for x})

    if (zoomOn) {
      return {
        x: Math.floor(canvas.width / 2 / 2 - 18),
        y: Math.floor(canvas.height / 2 / 2),
      };
    }
    return {
      x: Math.floor(canvas.width / 2 - 24),
      y: Math.floor(canvas.height / 2),
    };
  }

  function getScale() {
    return scale;
  }
  return {
    toggleZoom,
    overrideOffset,
    updateLastClickPosition,
    updateRenderingProjectiles,
    updateOffset,
    cameraState,
  };
}
export default CameraHandler;
