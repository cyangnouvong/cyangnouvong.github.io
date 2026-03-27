import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SWEEP_VERT, SWEEP_FRAG } from "../utils/shaders";
import { generateHeightMap } from "../utils/noise";
import { marchingSquares, type Segment } from "../utils/marchingSquares";
import { useTheme } from "../context/ThemeContext";
import { themes } from "../utils/themes";
import { useWindowSize } from "../utils/useWindowSize";

const CONTOUR_LEVELS = 30;
const GRID_SIZE = 256;
const WORLD_SIZE = 100;
const SWEEP_SPEED = 40;
const STRIPE_HALF = 90;

function getLevelStyle(i: number, mode: "Light" | "Dark", isMobile: boolean) {
  const t = themes[mode];
  const style =
    i % 4 === 0
      ? t.contour.major
      : i % 2 === 0
        ? t.contour.mid
        : t.contour.fine;

  return isMobile ? { ...style, opacity: style.opacity * 0.4 } : style;
}

function buildGeometry(
  segments: Segment[],
  cellW: number,
  cellH: number,
  halfX: number,
  halfY: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  for (const { x1, y1, x2, y2 } of segments) {
    positions.push(
      x1 * cellW - halfX,
      -(y1 * cellH - halfY),
      0.01,
      x2 * cellW - halfX,
      -(y2 * cellH - halfY),
      0.01,
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

const HeightMap = () => {
  const { mode } = useTheme();
  const { size } = useThree();

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const LEVELS = isMobile ? 5 : CONTOUR_LEVELS;
  const GRID = isMobile ? 48 : GRID_SIZE;
  const aspect = size.width / size.height;

  const halfX = (WORLD_SIZE * aspect) / 2;
  const halfY = WORLD_SIZE / 2;

  const diagMin = -(halfX + halfY) * 0.7071067;
  const diagMax = (halfX + halfY) * 0.7071067;

  const sweepRef = useRef(diagMin - STRIPE_HALF);

  const [geometries, setGeometries] = useState(() =>
    buildAllGeometries(aspect),
  );

  function buildAllGeometries(asp: number) {
    const cW = (WORLD_SIZE * asp) / GRID;
    const cH = WORLD_SIZE / GRID;
    const hX = (WORLD_SIZE * asp) / 2;
    const hY = WORLD_SIZE / 2;

    const map = generateHeightMap({
      gridSize: GRID,
      octaves: isMobile ? 2 : 6,
      scale: isMobile ? 8 : 3.5,
      persistence: 0.5,
      lacunarity: 2.0,
    });

    return Array.from({ length: LEVELS }, (_, i) => {
      const isoLevel = (i + 1) / (LEVELS + 1);
      const segments = marchingSquares(map, GRID, isoLevel);
      return segments.length > 0
        ? buildGeometry(segments, cW, cH, hX, hY)
        : null;
    });
  }

  const uniforms = useMemo(
    () => ({
      uSweepX: { value: sweepRef.current },
      uStripeHalf: { value: STRIPE_HALF },
    }),
    [],
  );

  useFrame((_, delta) => {
    sweepRef.current += SWEEP_SPEED * delta;
    uniforms.uSweepX.value = sweepRef.current;

    if (sweepRef.current > diagMax + STRIPE_HALF) {
      sweepRef.current = diagMin - STRIPE_HALF;
      setGeometries(buildAllGeometries(aspect));
    }
  });

  return (
    <group>
      {geometries.map((geo, i) => {
        if (!geo) return null;
        const { opacity, color } = getLevelStyle(i, mode, isMobile);
        return (
          <lineSegments key={i} geometry={geo}>
            <shaderMaterial
              uniforms={{
                uSweepX: uniforms.uSweepX,
                uStripeHalf: uniforms.uStripeHalf,
                uBaseOpacity: { value: opacity },
                uColor: { value: new THREE.Vector3(...color) },
              }}
              vertexShader={SWEEP_VERT}
              fragmentShader={SWEEP_FRAG}
              transparent
              depthWrite={false}
            />
          </lineSegments>
        );
      })}
    </group>
  );
};

export default HeightMap;
