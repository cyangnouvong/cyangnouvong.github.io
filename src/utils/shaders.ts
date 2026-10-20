// Contour line shaders: each segment is an instanced screen-space quad with a 1px anti-aliasing tent.

// Vertex: expands the unit quad along its segment, offset uHalfWidth pixels across it.
export const SWEEP_VERT = /* glsl */ `
  uniform vec2 uResolution;   // drawing-buffer size in device pixels
  uniform float uHalfWidth;   // half quad width in device pixels
  attribute vec3 instanceStart;
  attribute vec3 instanceEnd;
  varying float vDiag;
  varying float vAcross;

  void main() {
    vec3 local = mix(instanceStart, instanceEnd, position.x);
    vec4 worldPos = modelMatrix * vec4(local, 1.0);
    // Project onto the bottom-left → top-right diagonal.
    vDiag = (worldPos.x + worldPos.y) * 0.7071067;
    vAcross = position.y;

    mat4 mvp = projectionMatrix * viewMatrix * modelMatrix;
    vec4 clipStart = mvp * vec4(instanceStart, 1.0);
    vec4 clipEnd   = mvp * vec4(instanceEnd, 1.0);

    // NDC spans 2 units across the viewport, so px = ndc * resolution / 2.
    vec2 dirPx = (clipEnd.xy - clipStart.xy) * 0.5 * uResolution;
    float len = length(dirPx);
    vec2 dir = len > 0.0 ? dirPx / len : vec2(1.0, 0.0);
    vec2 normalPx = vec2(-dir.y, dir.x) * uHalfWidth * position.y;

    vec4 clip = mix(clipStart, clipEnd, position.x);
    clip.xy += normalPx * 2.0 / uResolution;
    gl_Position = clip;
  }
`;

// Fragment: cosine sweep falloff along the diagonal × the anti-aliasing tent across the quad.
export const SWEEP_FRAG = /* glsl */ `
  uniform float uSweepX;      // diagonal position of the sweep stripe center
  uniform float uStripeHalf;  // half-width of the stripe in world units
  uniform float uBaseOpacity; // per-level max opacity
  uniform vec3  uColor;       // per-level color
  varying float vDiag;
  varying float vAcross;

  void main() {
    float dist  = abs(vDiag - uSweepX);
    float t     = clamp(dist / uStripeHalf, 0.0, 1.0);
    // Cosine falloff: full opacity at stripe center, smoothly fades to 0 at edges
    float sweep = 0.5 * (1.0 + cos(t * 3.14159265));
    float coverage = 1.0 - abs(vAcross);
    float alpha = uBaseOpacity * sweep * coverage;
    if (alpha < 0.005) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
