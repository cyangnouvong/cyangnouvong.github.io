import LightPlane from "../../assets/plane.svg";
import DarkPlane from "../../assets/plane-alt.svg";

// Motion state for the paper plane and its trail; drawing lives in planeOverlay.ts.

export const TRAIL_MAX = 360;
const PLANE_SPEED = 0.0008;
const ZIG_AMPLITUDE = 0.32;
const ZIG_FREQUENCY = 0.18;
export const SVG_ROTATION_OFFSET = Math.PI / 4;

// Sizes as fractions of the card height.
export const PLANE_SIZE_FRAC = 0.055;
export const TRAIL_RADIUS_MIN_FRAC = 0.0012;
export const TRAIL_RADIUS_MAX_FRAC = 0.004;
export const TRAIL_ALPHA_POW = 1.8;
export const TRAIL_ALPHA_MAX = 0.9;

// Reference frame for the heading (the old canvas' logical height).
const H_LOGICAL = 1024;

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

export interface PlaneState {
  t: number;
  visualAngle: number;
  flipProgress: number;
  flipTarget: number;
  flipping: boolean;
  targetFlyingLeft: boolean;
  flyingLeft: boolean;
}

export interface PlaneSim {
  readonly state: PlaneState;
  /** Trail points, oldest first, as (x, y) fractions of the card; y grows downwards. */
  readonly trail: Float32Array;
  /** Number of valid points in `trail`. */
  readonly trailLength: number;
  /** Current plane position as fractions of the card. */
  planePos(): { x: number; y: number };
  update(active: boolean): void;
  reset(): void;
}

export function createPlaneSim(cardAspect: number): PlaneSim {
  const W_LOGICAL = Math.round(
    Math.max(256, Math.min(H_LOGICAL * cardAspect, H_LOGICAL * 2)),
  );

  const trail = new Float32Array(TRAIL_MAX * 2);
  let trailLength = 0;

  const state: PlaneState = {
    t: 0,
    visualAngle: 0,
    flipProgress: 1,
    flipTarget: 0,
    flipping: false,
    targetFlyingLeft: false,
    flyingLeft: false,
  };

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

    // Append the new point, dropping the oldest once the trail is full
    if (trailLength === TRAIL_MAX) {
      trail.copyWithin(0, 2);
      trailLength--;
    }
    trail[trailLength * 2] = pos.x;
    trail[trailLength * 2 + 1] = pos.y;
    trailLength++;
  }

  function reset() {
    trailLength = 0;
    state.t = 0;
  }

  return {
    state,
    trail,
    get trailLength() {
      return trailLength;
    },
    planePos: () => spiralPos(state.t),
    update,
    reset,
  };
}
