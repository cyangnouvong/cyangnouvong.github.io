import * as THREE from "three";
import {
  PLANE_SIZE_FRAC,
  SVG_ROTATION_OFFSET,
  TRAIL_ALPHA_MAX,
  TRAIL_ALPHA_POW,
  TRAIL_MAX,
  TRAIL_RADIUS_MAX_FRAC,
  TRAIL_RADIUS_MIN_FRAC,
  type PlaneSim,
} from "./planeSim";

// GPU drawing of the plane sprite (one textured quad) and its trail (one instanced draw of dots).

const SPRITE_TEX_SIZE = 256;
// Dot edge ramp width in backbuffer pixels.
const TRAIL_AA_PX = 1.5;

const glslFloat = (n: number) => n.toFixed(6);

const CARD_UNIFORM_DECLS = /* glsl */ `
  uniform vec2 uCardCenter;   // card centre, world units
  uniform vec2 uCardSize;     // card width/height, world units
`;

const trailVertexShader = /* glsl */ `
  attribute vec2 aPos;        // dot centre as a fraction of the card, y down
  attribute float aFrac;      // dot age, 0 = oldest, 1 = newest
  uniform float uPxPerUnit;   // backbuffer pixels per world unit
  ${CARD_UNIFORM_DECLS}
  varying vec2 vCorner;       // offset from the dot centre, pixels
  varying vec2 vLocal;        // position inside the card, [-0.5, 0.5]
  varying float vRadiusPx;
  varying float vAlpha;

  void main() {
    float cardHeightPx = uCardSize.y * uPxPerUnit;
    vRadiusPx = mix(${glslFloat(TRAIL_RADIUS_MIN_FRAC)}, ${glslFloat(TRAIL_RADIUS_MAX_FRAC)}, aFrac) * cardHeightPx;
    float halfPx = vRadiusPx + ${glslFloat(TRAIL_AA_PX)};
    vCorner = position.xy * halfPx;
    vAlpha = pow(aFrac, ${glslFloat(TRAIL_ALPHA_POW)}) * ${glslFloat(TRAIL_ALPHA_MAX)};
    vec2 centre = (aPos - 0.5) * vec2(1.0, -1.0) * uCardSize;
    vec2 local = centre + vCorner / uPxPerUnit;
    vLocal = local / uCardSize;
    gl_Position = projectionMatrix * viewMatrix * vec4(uCardCenter + local, 0.0, 1.0);
  }
`;

const trailFragmentShader = /* glsl */ `
  varying vec2 vCorner;
  varying vec2 vLocal;
  varying float vRadiusPx;
  varying float vAlpha;

  void main() {
    if (abs(vLocal.x) > 0.5 || abs(vLocal.y) > 0.5) discard;
    float d = length(vCorner);
    float coverage = clamp((vRadiusPx - d) / ${glslFloat(TRAIL_AA_PX)} + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(coverage * vAlpha);
  }
`;

const spriteVertexShader = /* glsl */ `
  ${CARD_UNIFORM_DECLS}
  varying vec2 vUv;
  varying vec2 vLocal;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vLocal = (world.xy - uCardCenter) / uCardSize;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const spriteFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying vec2 vLocal;

  void main() {
    if (abs(vLocal.x) > 0.5 || abs(vLocal.y) > 0.5) discard;
    gl_FragColor = texture2D(uMap, vUv);
  }
`;

/** Rasterises the two plane SVGs (flipped, original) into textures shared by every card. */
export function createPlaneTextures(
  imgs: [HTMLImageElement, HTMLImageElement],
): [THREE.Texture, THREE.Texture] {
  const make = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = SPRITE_TEX_SIZE;
    canvas.height = SPRITE_TEX_SIZE;
    canvas
      .getContext("2d")!
      .drawImage(img, 0, 0, SPRITE_TEX_SIZE, SPRITE_TEX_SIZE);
    const tex = new THREE.CanvasTexture(canvas);
    // Keep the canvas premultiplied so mipmaps don't fringe.
    tex.premultiplyAlpha = true;
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  };
  return [make(imgs[0]), make(imgs[1])];
}

export interface PlaneOverlay {
  trail: THREE.Mesh;
  sprite: THREE.Mesh;
  /** Syncs the meshes with the sim; cx, cy, w, h are the card's centre and size in world units. */
  update(
    sim: PlaneSim,
    show: boolean,
    cx: number,
    cy: number,
    w: number,
    h: number,
    pxPerUnit: number,
    textures: [THREE.Texture, THREE.Texture] | null,
  ): void;
  dispose(): void;
}

export function createPlaneOverlay(): PlaneOverlay {
  const cardUniforms = {
    uCardCenter: { value: new THREE.Vector2() },
    uCardSize: { value: new THREE.Vector2(1, 1) },
  };

  // Trail: one quad instanced per dot
  const trailGeometry = new THREE.InstancedBufferGeometry();
  trailGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0],
      3,
    ),
  );
  trailGeometry.setIndex([0, 1, 2, 0, 2, 3]);
  const aPos = new THREE.InstancedBufferAttribute(
    new Float32Array(TRAIL_MAX * 2),
    2,
  );
  const aFrac = new THREE.InstancedBufferAttribute(
    new Float32Array(TRAIL_MAX),
    1,
  );
  aPos.setUsage(THREE.DynamicDrawUsage);
  aFrac.setUsage(THREE.DynamicDrawUsage);
  trailGeometry.setAttribute("aPos", aPos);
  trailGeometry.setAttribute("aFrac", aFrac);
  trailGeometry.instanceCount = 0;

  const trailMaterial = new THREE.ShaderMaterial({
    uniforms: { ...cardUniforms, uPxPerUnit: { value: 1 } },
    vertexShader: trailVertexShader,
    fragmentShader: trailFragmentShader,
    transparent: true,
    premultipliedAlpha: true,
    depthTest: false,
    depthWrite: false,
  });

  const trail = new THREE.Mesh(trailGeometry, trailMaterial);
  trail.frustumCulled = false;
  trail.raycast = () => {};
  trail.visible = false;

  // Plane: one textured quad
  const spriteGeometry = new THREE.PlaneGeometry(1, 1);
  const spriteUniforms = {
    ...cardUniforms,
    uMap: { value: null as THREE.Texture | null },
  };
  const spriteMaterial = new THREE.ShaderMaterial({
    uniforms: spriteUniforms,
    vertexShader: spriteVertexShader,
    fragmentShader: spriteFragmentShader,
    transparent: true,
    premultipliedAlpha: true,
    depthTest: false,
    depthWrite: false,
    // The flip animation mirrors the quad, which reverses its winding
    side: THREE.DoubleSide,
  });

  const sprite = new THREE.Mesh(spriteGeometry, spriteMaterial);
  sprite.frustumCulled = false;
  sprite.matrixAutoUpdate = false;
  sprite.raycast = () => {};
  sprite.visible = false;

  const tmp = new THREE.Matrix4();

  function update(
    sim: PlaneSim,
    show: boolean,
    cx: number,
    cy: number,
    w: number,
    h: number,
    pxPerUnit: number,
    textures: [THREE.Texture, THREE.Texture] | null,
  ) {
    const n = sim.trailLength;
    const drawTrail = show && n >= 2;
    trail.visible = drawTrail;
    sprite.visible = drawTrail && textures !== null;
    if (!drawTrail) return;

    cardUniforms.uCardCenter.value.set(cx, cy);
    cardUniforms.uCardSize.value.set(w, h);
    trailMaterial.uniforms.uPxPerUnit.value = pxPerUnit;

    // Same as the canvas loop: skip the oldest point, age fraction i / n
    const pos = aPos.array as Float32Array;
    const frac = aFrac.array as Float32Array;
    for (let i = 1; i < n; i++) {
      pos[(i - 1) * 2] = sim.trail[i * 2];
      pos[(i - 1) * 2 + 1] = sim.trail[i * 2 + 1];
      frac[i - 1] = i / n;
    }
    trailGeometry.instanceCount = n - 1;
    aPos.needsUpdate = true;
    aFrac.needsUpdate = true;

    if (!sprite.visible || !textures) return;

    const s = sim.state;
    const p = sim.planePos();
    const flipScale = Math.abs(Math.cos(s.flipProgress * Math.PI));
    const showFlipped = s.flipProgress < 0.5 ? s.flyingLeft : s.targetFlyingLeft;
    spriteUniforms.uMap.value = showFlipped ? textures[0] : textures[1];

    // The old y-down canvas transform in a y-up frame: same scale, opposite rotation.
    const size = PLANE_SIZE_FRAC * h;
    const sy = showFlipped ? -flipScale : flipScale;
    const m = sprite.matrix;
    m.makeTranslation(cx + (p.x - 0.5) * w, cy + (0.5 - p.y) * h, 0);
    m.multiply(tmp.makeScale(1, sy, 1));
    m.multiply(tmp.makeRotationZ(-(s.visualAngle + SVG_ROTATION_OFFSET)));
    m.multiply(tmp.makeScale(size, size, 1));
    sprite.matrixWorldNeedsUpdate = true;
  }

  function dispose() {
    trailGeometry.dispose();
    trailMaterial.dispose();
    spriteGeometry.dispose();
    spriteMaterial.dispose();
  }

  return { trail, sprite, update, dispose };
}
