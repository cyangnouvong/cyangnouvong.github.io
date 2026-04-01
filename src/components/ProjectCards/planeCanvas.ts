import LightPlane from "../../assets/plane.svg";
import DarkPlane from "../../assets/plane-alt.svg";

const TRAIL_MAX = 360;
const PLANE_SPEED = 0.0008;
const ZIG_AMPLITUDE = 0.32;
const ZIG_FREQUENCY = 0.18;
const SVG_ROTATION_OFFSET = Math.PI / 4;

export function loadPlaneImage(mode: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = mode === "Light" ? DarkPlane : LightPlane;
  });
}

function spiralPos(t: number) {
  return {
    x: 0.5 + ZIG_AMPLITUDE * Math.sin((t * Math.PI * 2) / ZIG_FREQUENCY),
    y: t,
  };
}

export function createPlaneCanvas(overlayAspect: number) {
  const H = 1024;
  const W = Math.round(Math.max(256, Math.min(H * overlayAspect, H * 2)));

  const PLANE_SIZE = H * 0.055;
  const TRAIL_RADIUS_MIN = H * 0.0012;
  const TRAIL_RADIUS_MAX = H * 0.004;

  const canvasFront = document.createElement("canvas");

  canvasFront.width = W;
  canvasFront.height = H;

  const ctxF = canvasFront.getContext("2d", { alpha: true })!;

  const state = { t: 0, angle: 0 };
  const trail: { x: number; y: number }[] = [];

  function update(active: boolean) {
    if (!active) return;

    state.t += PLANE_SPEED;
    if (state.t > 1.1) state.t = -0.1;

    const pos = spiralPos(state.t);
    const ahead = spiralPos(state.t + 0.001);

    const dx = (ahead.x - pos.x) * W;
    const dy = (ahead.y - pos.y) * H;
    state.angle = Math.atan2(dy, dx);

    trail.push({ x: pos.x, y: pos.y });
    if (trail.length > TRAIL_MAX) trail.shift();
  }

  function drawLayer(
    ctx: CanvasRenderingContext2D,
    active: boolean,
    planeImg: HTMLImageElement | null,
  ) {
    ctx.clearRect(0, 0, W, H);
    if (!active || trail.length < 2) return;

    for (let i = 1; i < trail.length; i++) {
      const frac = i / trail.length;
      const alpha = Math.pow(frac, 1.8) * 0.9;
      const radius =
        TRAIL_RADIUS_MIN + frac * (TRAIL_RADIUS_MAX - TRAIL_RADIUS_MIN);

      ctx.beginPath();
      ctx.arc(trail[i].x * W, trail[i].y * H, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    const pos = spiralPos(state.t);
    const px = pos.x * W;
    const py = pos.y * H;
    const size = PLANE_SIZE;
    const half = size / 2;

    ctx.save();
    ctx.translate(px, py);

    const flyingLeft = Math.cos(state.angle) < 0;
    if (flyingLeft) {
      ctx.scale(1, -1);
      ctx.rotate(-state.angle + SVG_ROTATION_OFFSET);
    } else {
      ctx.rotate(state.angle + SVG_ROTATION_OFFSET);
    }

    if (planeImg) {
      ctx.drawImage(planeImg, -half, -half, size, size);
    }

    ctx.restore();
  }

  function draw(active: boolean, planeImg: HTMLImageElement | null) {
    drawLayer(ctxF, active, planeImg);
  }

  function reset() {
    trail.length = 0;
    state.t = 0;
  }

  return { canvasFront, update, draw, reset };
}
