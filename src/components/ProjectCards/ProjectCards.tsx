import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./CardScene";
import { loadPlaneImage } from "./planeCanvas";
import { useTheme } from "../../context/ThemeContext";

const TOTAL_CARDS = 3;
const SWIPE_THRESHOLD = 40; // px

interface ProjectCardsProps {
  active: number | null;
  setActive: (active: number | null) => void;
  inView: boolean;
}

const ProjectCards = ({ active, setActive, inView }: ProjectCardsProps) => {
  const [planeImg, setPlaneImg] = useState<HTMLImageElement | null>(null);
  const { mode } = useTheme();

  useEffect(() => {
    loadPlaneImage(mode).then(setPlaneImg);
  }, [mode]);

  // Swipe detection
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Only swipe in portrait (single-card) mode
    if (window.innerWidth >= window.innerHeight) return;
    // Ignore mostly-vertical gestures so page scroll still works
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    const current = active ?? 0;
    setActive(
      dx < 0
        ? Math.min(current + 1, TOTAL_CARDS - 1)
        : Math.max(current - 1, 0),
    );
  };

  return (
    <div
      style={{ position: "absolute", inset: 0 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100 }}
        gl={{ antialias: true, stencil: true, premultipliedAlpha: false }}
        style={{ width: "100%", height: "100%" }}
        onPointerMissed={() => setActive(null)}
        frameloop={inView ? "always" : "never"}
      >
        <Scene active={active} setActive={setActive} planeImg={planeImg} />
      </Canvas>
    </div>
  );
};

export default ProjectCards;
