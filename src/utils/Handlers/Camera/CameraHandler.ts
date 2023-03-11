import { Vector } from "../../../Objects/SpriteTypes";

function CameraHandler(canvas: { width: number; height: number }) {
  let zoomOn = false;
  let scale = 1;
  const offset = { x: 48, y: 0 };
  const lastClickPosition = { x: 0, y: 0 };
  const CameraState = { zoomOn, scale, offset, lastClickPosition };

  function toggleZoom(zoomState: boolean) {
    if (zoomState) {
      updateOffset("y", "-", 28.8 * 5);
      updateOffset("x", "-", 210);
      scale = 2;
      zoomOn = zoomState;
    } else if (!zoomState) {
      updateOffset("y", "+", 28.8 * 5);
      updateOffset("x", "+", 42 * 5);
      scale = 1;
      zoomOn = zoomState;
    }
  }

  function getLastClickPosition(): Vector {
    return {
      x: lastClickPosition.x / scale,
      y: lastClickPosition.y / scale,
    };
  }

  function updateLastClickPosition(newPos: Vector) {
    lastClickPosition.x = newPos.x;
    lastClickPosition.y = newPos.y;
  }

  function getScreenCenter(): Vector {
    if (zoomOn) {
      return {
        x: Math.floor(canvas.width / 2 / 2 - 8),
        y: Math.floor(canvas.height / 2 / 2),
      };
    }
    return {
      x: Math.floor(canvas.width / 2 - 16),
      y: Math.floor(canvas.height / 2),
    };
  }

  function updateOffset(pos: "x" | "y", operand: "+" | "-", speed = 6) {
    if (operand === "+") {
      offset[pos] += speed;
    }
    if (operand === "-") {
      offset[pos] -= speed;
    }
  }
  function getScale() {
    return scale;
  }
  return {
    CameraState,
    toggleZoom,
    getLastClickPosition,
    updateLastClickPosition,
    getScreenCenter,
    updateOffset,
    getScale,
  };
}
export default CameraHandler;
