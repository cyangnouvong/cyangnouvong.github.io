import { Canvas } from "@react-three/fiber";
import HeightMap from "./HeightMap";
import { useTheme } from "../context/ThemeContext";
import { themes } from "../utils/themes";
import { useWindowSize } from "../utils/useWindowSize";

const frustum = 100;

const Scene = () => {
  const { mode } = useTheme();
  const { height } = useWindowSize();
  const zoom = height / frustum; // maps world units to pixels

  /**
   * Camera in vanilla Three.js is defined differently than in react-three-fiber.
   * In vanilla, you set left, right, top, bottom planes directly.
   * In r3f, you set zoom and it calculates the planes for you based on the canvas size.
   * So we just need to calculate the appropriate zoom level to fit our world units to the screen pixels.
   */
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
        style={{ background: themes[mode].bg }}
      >
        <HeightMap key={mode} frustum={frustum} />
      </Canvas>
    </div>
  );
};

export default Scene;
