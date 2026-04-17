import LightPlane from "../../assets/plane.svg";
import DarkPlane from "../../assets/plane-alt.svg";

const TRAIL_MAX = 360;
const PLANE_SPEED = 0.0008;
const ZIG_AMPLITUDE = 0.32;
const ZIG_FREQUENCY = 0.18;
const SVG_ROTATION_OFFSET = Math.PI / 4;

export function loadPlaneImages(
  mode: "Light" | "Dark",
): Promise<[HTMLImageElement, HTMLImageElement]> {
  const src = mode === "Light" ? DarkPlane : LightPlane;

  const loadImg = (svgSrc: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = svgSrc;
    });

  const flipColors = (svgText: string): string => {
    const colors = {
      Dark: ["#91b6d0", "#454e78"],
      Light: ["#827d7d", "#644747"],
    };

    return svgText
      .replace(new RegExp(colors[mode][0], "gi"), "__TEMP__")
      .replace(new RegExp(colors[mode][1], "gi"), colors[mode][0])
      .replace(/__TEMP__/gi, colors[mode][1]);
  };

  return fetch(src)
    .then((r) => r.text())
    .then((svgText) => {
      const original = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      const flipped = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(flipColors(svgText))}`;
      return Promise.all([loadImg(flipped), loadImg(original)]);
    });
}

function spiralPos(t: number) {
  return {
    x: 0.5 + ZIG_AMPLITUDE * Math.sin((t * Math.PI * 2) / ZIG_FREQUENCY),
    y: t,
  };
}

// Cap DPR so ultra-dense screens don't blow up canvas memory/perf
const MAX_DPR = 2;

export function createPlaneCanvas(overlayAspect: number, dpr: number = 1) {
  const safeDpr = Math.min(dpr, MAX_DPR);

  // Base logical resolution, then scale up by DPR for sharpness
  const H_LOGICAL = 1024;
  const W_LOGICAL = Math.round(
    Math.max(256, Math.min(H_LOGICAL * overlayAspect, H_LOGICAL * 2)),
  );

  const W = Math.round(W_LOGICAL * safeDpr);
  const H = Math.round(H_LOGICAL * safeDpr);

  const PLANE_SIZE = H * 0.055;
  const TRAIL_RADIUS_MIN = H * 0.0012;
  const TRAIL_RADIUS_MAX = H * 0.004;

  const canvasFront = document.createElement("canvas");
  canvasFront.width = W;
  canvasFront.height = H;

  const ctxF = canvasFront.getContext("2d", { alpha: true })!;

  // Scale all drawing operations by DPR so coordinates stay logical
  ctxF.scale(safeDpr, safeDpr);

  const trail: { x: number; y: number }[] = [];

  const state = {
    t: 0,
    visualAngle: 0,
    flipProgress: 1,
    flipTarget: 0,
    flipping: false,
    targetFlyingLeft: false,
    flyingLeft: false,
  };

  // Track whether the canvas actually changed so the caller can skip needsUpdate
  let dirty = false;
  // Track whether the canvas has visible content so we can issue one final clear
  let hasContent = false;

  function update(active: boolean) {
    if (!active) return;

    state.t += PLANE_SPEED;
    if (state.t > 1.1) state.t = -0.1;

    const pos = spiralPos(state.t);
    const ahead = spiralPos(state.t + 0.001);

    const dx = (ahead.x - pos.x) * W_LOGICAL;
    const dy = (ahead.y - pos.y) * H_LOGICAL;
    const rawAngle = Math.atan2(dy, dx);

    const cosAngle = Math.cos(rawAngle);
    const flyingLeft = cosAngle < -0.1;
    const flyingRight = cosAngle > 0.1;
    const newDirection = flyingLeft
      ? true
      : flyingRight
        ? false
        : state.targetFlyingLeft;

    if (newDirection !== state.targetFlyingLeft) {
      state.targetFlyingLeft = newDirection;
      state.flipping = true;
      state.flipProgress = 0;
    }

    if (state.flipping) {
      state.flipTarget += 0.05;
      if (state.flipTarget > 1) {
        state.flipProgress += 0.025;
      }
      if (state.flipProgress >= 1) {
        state.flipProgress = 1;
        state.flipTarget = 0;
        state.flipping = false;
        state.flyingLeft = state.targetFlyingLeft;
      }
    }

    const targetAngle = state.flyingLeft ? -rawAngle : rawAngle;
    let delta = targetAngle - state.visualAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    state.visualAngle += delta * 0.06;

    trail.push({ x: pos.x, y: pos.y });
    if (trail.length > TRAIL_MAX) trail.shift();

    dirty = true;
  }

  function drawLayer(
    ctx: CanvasRenderingContext2D,
    active: boolean,
    planeFlippedImg: HTMLImageElement | null,
    planeOriginalImg: HTMLImageElement | null,
  ) {
    // Use logical dimensions for all drawing (ctxF is pre-scaled by DPR)
    ctx.clearRect(0, 0, W_LOGICAL, H_LOGICAL);
    if (!active || trail.length < 2) return;

    for (let i = 1; i < trail.length; i++) {
      const frac = i / trail.length;
      const alpha = Math.pow(frac, 1.8) * 0.9;
      const radius =
        TRAIL_RADIUS_MIN / safeDpr +
        (frac * (TRAIL_RADIUS_MAX - TRAIL_RADIUS_MIN)) / safeDpr;

      ctx.beginPath();
      ctx.arc(
        trail[i].x * W_LOGICAL,
        trail[i].y * H_LOGICAL,
        radius,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    const pos = spiralPos(state.t);
    const px = pos.x * W_LOGICAL;
    const py = pos.y * H_LOGICAL;
    const size = PLANE_SIZE / safeDpr;
    const half = size / 2;

    const flipScale = Math.abs(Math.cos(state.flipProgress * Math.PI));
    const showFlippedImg =
      state.flipProgress < 0.5 ? state.flyingLeft : state.targetFlyingLeft;
    const planeImg = showFlippedImg ? planeFlippedImg : planeOriginalImg;

    ctx.save();
    ctx.translate(px, py);
    ctx.scale(1, showFlippedImg ? -flipScale : flipScale);
    ctx.rotate(state.visualAngle + SVG_ROTATION_OFFSET);
    if (planeImg) ctx.drawImage(planeImg, -half, -half, size, size);
    ctx.restore();
  }

  function draw(
    active: boolean,
    planeFlippedImg: HTMLImageElement | null,
    planeOriginalImg: HTMLImageElement | null,
  ): boolean {
    // If idle and canvas is already blank, nothing to do
    if (!active && !hasContent && !dirty) return false;

    drawLayer(ctxF, active, planeFlippedImg, planeOriginalImg);

    const didChange = dirty || hasContent !== active;
    hasContent = active;
    dirty = false;
    return didChange;
  }

  function reset() {
    trail.length = 0;
    state.t = 0;
    dirty = true;
    hasContent = false;
  }

  return { canvasFront, update, draw, reset };
}
