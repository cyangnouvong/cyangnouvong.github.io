import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./CardScene";
import { loadPlaneImage } from "./planeCanvas";
import { useTheme } from "../../context/ThemeContext";

const ProjectCards = (
  active: number | null,
  setActive: (active: number | null) => void,
) => {
  const [planeImg, setPlaneImg] = useState<HTMLImageElement | null>(null);
  const { mode } = useTheme();

  useEffect(() => {
    loadPlaneImage(mode).then(setPlaneImg);
  }, [mode]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100 }}
        gl={{ antialias: true, stencil: true, premultipliedAlpha: false }}
        style={{ position: "absolute", inset: 0 }}
        resize={{ debounce: 0 }}
        onPointerMissed={() => setActive(null)}
      >
        <Scene active={active} setActive={setActive} planeImg={planeImg} />
      </Canvas>
    </div>
  );
};

export default ProjectCards;
