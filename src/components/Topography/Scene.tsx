import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import HeightMap from "./HeightMap";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../utils/themes";
import { useWindowSize } from "../../utils/useWindowSize";

const frustum = 100;

// DPR cap: the contours are 1px lines, so 1.5× keeps them crisp.
const MAX_DPR = 1.5;
// Also keep the backbuffer under a fixed pixel budget.
const MAX_PIXELS = 10_000_000;

function pickDpr(cssWidth: number, cssHeight: number) {
  const budget = Math.sqrt(MAX_PIXELS / Math.max(1, cssWidth * cssHeight));
  return Math.max(1, Math.min(MAX_DPR, budget));
}

const Scene = () => {
  const { mode } = useTheme();
  const { width, height } = useWindowSize();
  const zoom = height / frustum; // maps world units to pixels
  const dpr = pickDpr(width, height);

  // Only render while the hero is on screen.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    // 1% threshold: a 1px sliver can remain after the "See my work" scroll.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio >= 0.01),
      { threshold: [0, 0.01] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom, near: 0.1, far: 1000 }}
        // No MSAA (the contour shader anti-aliases itself) and no depth buffer.
        gl={{
          antialias: false,
          depth: false,
          powerPreference: "high-performance",
        }}
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        style={{ background: themes[mode].bg }}
      >
        <HeightMap key={mode} />
      </Canvas>
    </div>
  );
};

export default Scene;
