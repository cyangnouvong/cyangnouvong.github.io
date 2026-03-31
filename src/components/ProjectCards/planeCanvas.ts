import LightPlane from "../../assets/plane.svg";
import DarkPlane from "../../assets/plane-alt.svg";

const TRAIL_MAX = 120;
const PLANE_SPEED = 0.001;
const ZIG_AMPLITUDE = 0.47;
const ZIG_FREQUENCY = 0.1;
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

function isFrontPass(t: number): boolean {
  return spiralPos(t + 0.001).x > spiralPos(t).x;
}

export function createPlaneCanvas(overlayAspect: number) {
  const H = 1024;
  const W = Math.round(H * overlayAspect);

  const canvasFront = document.createElement("canvas");
  const canvasBack = document.createElement("canvas");

  canvasFront.width = canvasBack.width = W;
  canvasFront.height = canvasBack.height = H;

  const ctxF = canvasFront.getContext("2d", { alpha: true })!;
  const ctxB = canvasBack.getContext("2d", { alpha: true })!;

  const state = { t: 0, angle: 0 };
  const trail: { x: number; y: number; front: boolean }[] = [];

  function update(active: boolean) {
    if (!active) return;

    state.t += PLANE_SPEED;
    if (state.t > 1.1) state.t = -0.1;

    const pos = spiralPos(state.t);
    const ahead = spiralPos(state.t + 0.001);

    const dx = (ahead.x - pos.x) * overlayAspect;
    const dy = ahead.y - pos.y;

    state.angle = Math.atan2(dy, dx);

    trail.push({ x: pos.x, y: pos.y, front: isFrontPass(state.t) });
    if (trail.length > TRAIL_MAX) trail.shift();
  }

  function drawLayer(
    ctx: CanvasRenderingContext2D,
    isFrontLayer: boolean,
    active: boolean,
    planeImg: HTMLImageElement | null,
  ) {
    ctx.clearRect(0, 0, W, H);
    if (!active || trail.length < 2) return;

    for (let i = 1; i < trail.length; i++) {
      if (trail[i].front !== isFrontLayer) continue;
      if (i % 2 !== 0) continue;

      const frac = i / trail.length;
      const alpha = Math.pow(frac, 1.8) * (isFrontLayer ? 0.9 : 0.5);
      const radius = 1.2 + frac * 3.2;

      ctx.beginPath();
      ctx.arc(trail[i].x * W, trail[i].y * H, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    if (isFrontPass(state.t) !== isFrontLayer) return;

    const pos = spiralPos(state.t);
    const px = pos.x * W;
    const py = pos.y * H;

    const size = isFrontLayer ? 56 : 44;
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
    drawLayer(ctxF, true, active, planeImg);
    drawLayer(ctxB, false, active, planeImg);
  }

  function reset() {
    trail.length = 0;
    state.t = 0;
  }

  return { canvasFront, canvasBack, update, draw, reset };
}
