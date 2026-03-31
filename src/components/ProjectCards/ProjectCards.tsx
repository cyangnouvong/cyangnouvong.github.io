import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./CardScene";
import { loadPlaneImage } from "./planeCanvas";
import { useTheme } from "../../context/ThemeContext";

interface ProjectCardsProps {
  active: number | null;
  setActive: (active: number | null) => void;
  inView: boolean;
  isSquare: boolean;
}

const ProjectCards = ({
  active,
  setActive,
  inView,
  isSquare,
}: ProjectCardsProps) => {
  const [planeImg, setPlaneImg] = useState<HTMLImageElement | null>(null);
  const { mode } = useTheme();

  useEffect(() => {
    loadPlaneImage(mode).then(setPlaneImg);
  }, [mode]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100 }}
        gl={{ antialias: true, stencil: true, premultipliedAlpha: false }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "-5%",
          width: "110%",
        }}
        onPointerMissed={() => setActive(null)}
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
      >
        <Scene
          active={active}
          setActive={setActive}
          planeImg={planeImg}
          isSquare={isSquare}
        />
      </Canvas>
    </div>
  );
};

export default ProjectCards;
