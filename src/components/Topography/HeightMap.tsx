import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SWEEP_VERT, SWEEP_FRAG } from "../../utils/shaders";
import type {
  ContourRequest,
  ContourResponse,
} from "../../utils/contourWorker";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../utils/themes";
import { useWindowSize } from "../../utils/useWindowSize";

const CONTOUR_LEVELS = 30;
const GRID_SIZE = 256;
const WORLD_SIZE = 100;
const SWEEP_SPEED = 40;
const STRIPE_HALF = 90;

// Shared by every contour material and mutated in place each frame.
const sweepUniforms = {
  uSweepX: { value: -999 },
  uStripeHalf: { value: STRIPE_HALF },
  uResolution: { value: new THREE.Vector2(1, 1) },
  // Quad half-width in device pixels (reads as a 1px anti-aliased line).
  uHalfWidth: { value: 1 },
};

// Unit quad per segment: x along it (0→1), y across it (-1→1).
const QUAD_POSITIONS = new Float32Array([0, -1, 0, 1, -1, 0, 1, 1, 0, 0, 1, 0]);
const QUAD_INDEX = [0, 1, 2, 0, 2, 3];

type ContourGeometry = THREE.InstancedBufferGeometry | null;

function getLevelStyle(i: number, mode: "Light" | "Dark", isMobile: boolean) {
  const t = themes[mode];
  const style =
    i % 4 === 0
      ? t.contour.major
      : i % 2 === 0
        ? t.contour.mid
        : t.contour.fine;

  return isMobile ? { ...style, opacity: style.opacity * 0.3 } : style;
}

/** Wraps transferred [x1, y1, 0, x2, y2, 0, ...] arrays in instanced geometries. */
function toGeometries(positions: Float32Array[]): ContourGeometry[] {
  return positions.map((pos) => {
    if (pos.length === 0) return null;
    const geo = new THREE.InstancedBufferGeometry();
    geo.setIndex(QUAD_INDEX);
    // Own copy per geometry; disposing one must not free the others' buffers.
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(QUAD_POSITIONS.slice(), 3),
    );
    const segments = new THREE.InstancedInterleavedBuffer(pos, 6, 1);
    geo.setAttribute(
      "instanceStart",
      new THREE.InterleavedBufferAttribute(segments, 3, 0),
    );
    geo.setAttribute(
      "instanceEnd",
      new THREE.InterleavedBufferAttribute(segments, 3, 3),
    );
    geo.instanceCount = pos.length / 6;
    return geo;
  });
}

function disposeAll(geometries: ContourGeometry[]) {
  for (const geo of geometries) geo?.dispose();
}

const HeightMap = () => {
  const { mode } = useTheme();
  const { size } = useThree();

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const LEVELS = isMobile ? 15 : CONTOUR_LEVELS;
  const GRID = isMobile ? 128 : GRID_SIZE;

  const aspect = size.width / size.height;

  // Grid units; the <group> below maps them to world units.
  const cellW = (WORLD_SIZE * aspect) / GRID;
  const cellH = WORLD_SIZE / GRID;
  const halfX = (WORLD_SIZE * aspect) / 2;
  const halfY = WORLD_SIZE / 2;

  const diagMin = -(halfX + halfY) * 0.7071067;
  const diagMax = (halfX + halfY) * 0.7071067;

  const sweepRef = useRef(diagMin - STRIPE_HALF);

  const [geometries, setGeometries] = useState<ContourGeometry[]>([]);

  // The worker keeps the next map ready so the swap at a sweep wrap is instant.
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<ContourGeometry[] | null>(null);
  const requestIdRef = useRef(0);
  const needsSwapRef = useRef(false);

  const requestRef = useRef<() => void>(() => {});

  useEffect(() => {
    const worker = new Worker(
      new URL("../../utils/contourWorker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    const request = () => {
      const msg: ContourRequest = {
        id: ++requestIdRef.current,
        levels: LEVELS,
        noise: {
          gridSize: GRID,
          octaves: isMobile ? 2 : 6,
          scale: isMobile ? 8 : 3.5,
          persistence: 0.5,
          lacunarity: 2.0,
        },
      };
      worker.postMessage(msg);
    };
    requestRef.current = request;

    let first = true;
    worker.onmessage = (e: MessageEvent<ContourResponse>) => {
      if (e.data.id !== requestIdRef.current) return; // stale
      const geos = toGeometries(e.data.positions);
      if (first) {
        // First map: show it right away, then pre-build the next one.
        first = false;
        setGeometries(geos);
        request();
      } else if (needsSwapRef.current) {
        // The sweep already wrapped while we were still computing.
        needsSwapRef.current = false;
        setGeometries((prev) => {
          disposeAll(prev);
          return geos;
        });
        request();
      } else {
        pendingRef.current = geos;
      }
    };

    request();

    return () => {
      worker.terminate();
      workerRef.current = null;
      requestRef.current = () => {};
      if (pendingRef.current) disposeAll(pendingRef.current);
      pendingRef.current = null;
      setGeometries((prev) => {
        disposeAll(prev);
        return [];
      });
    };
  }, [LEVELS, GRID, isMobile]);

  useFrame((state, delta) => {
    sweepRef.current += SWEEP_SPEED * delta;
    sweepUniforms.uSweepX.value = sweepRef.current;
    state.gl.getDrawingBufferSize(sweepUniforms.uResolution.value);

    if (sweepRef.current > diagMax + STRIPE_HALF) {
      sweepRef.current = diagMin - STRIPE_HALF;

      const next = pendingRef.current;
      if (next) {
        pendingRef.current = null;
        setGeometries((prev) => {
          disposeAll(prev);
          return next;
        });
        // Kick off the following map now so it's ready before the next wrap.
        requestRef.current();
      } else {
        needsSwapRef.current = true;
      }
    }
  });

  return (
    <group position={[-halfX, halfY, 0.01]} scale={[cellW, -cellH, 1]}>
      {geometries.map((geo, i) => {
        if (!geo) return null;
        const { opacity, color } = getLevelStyle(i, mode, isMobile);
        return (
          // The bounding sphere only covers the unit quad.
          <mesh key={i} geometry={geo} frustumCulled={false}>
            <shaderMaterial
              // Three caches the uniforms object at compile time; re-key to recreate.
              key={`${color.join(",")}-${opacity}`}
              uniforms={{
                uSweepX: sweepUniforms.uSweepX,
                uStripeHalf: sweepUniforms.uStripeHalf,
                uResolution: sweepUniforms.uResolution,
                uHalfWidth: sweepUniforms.uHalfWidth,
                uBaseOpacity: { value: opacity },
                uColor: { value: new THREE.Vector3(...color) },
              }}
              vertexShader={SWEEP_VERT}
              fragmentShader={SWEEP_FRAG}
              transparent
              depthWrite={false}
              // Winding depends on the segment direction.
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default HeightMap;
