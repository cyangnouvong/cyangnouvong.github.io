import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import DarkPlane from "./../../assets/plane-alt.svg";
import LightPlane from "./../../assets/plane.svg";
import "./styles.css";

type FlyingPlaneProps = {
  menuItem: string;
  position: { startX: number; startY: number };
};

function generatePaperPlanePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): string {
  const totalDX = endX - startX;
  const totalDY = endY - startY;
  const lateralSign = Math.random() > 0.5 ? 1 : -1;

  const points = [
    { x: startX, y: startY },
    {
      x: startX + totalDX * 0.25 + lateralSign * (30 + Math.random() * 40),
      y: startY + totalDY * 0.25 - (80 + Math.random() * 60),
    },
    {
      x: startX + totalDX * 0.55 + lateralSign * (20 + Math.random() * 30),
      y: startY + totalDY * 0.5 - (20 + Math.random() * 40),
    },
    {
      x: startX + totalDX * 0.8 + lateralSign * (Math.random() * 20),
      y: startY + totalDY * 0.8 + (10 + Math.random() * 20),
    },
    { x: endX, y: endY },
  ];

  const tension = 0.35;
  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[Math.max(i - 1, 0)];
    const curr = points[i];
    const next = points[i + 1];
    const after = points[Math.min(i + 2, points.length - 1)];

    const cp1x = curr.x + (next.x - prev.x) * tension;
    const cp1y = curr.y + (next.y - prev.y) * tension;
    const cp2x = next.x - (after.x - curr.x) * tension;
    const cp2y = next.y - (after.y - curr.y) * tension;

    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }

  return d;
}

const FlyingPlane = ({ menuItem, position }: FlyingPlaneProps) => {
  const [path, setPath] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const prevMenuItemRef = useRef<string | null>(null);
  const { mode } = useTheme();

  useEffect(() => {
    if (prevMenuItemRef.current === null) {
      prevMenuItemRef.current = menuItem;
      return;
    }
    if (prevMenuItemRef.current === menuItem) return;
    prevMenuItemRef.current = menuItem;
    if (position.startX === 0 && position.startY === 0) return;

    const startX = -80;
    const startY = window.innerHeight * (0.1 + Math.random() * 0.4); // 10%–50% of screen height
    setPath(
      generatePaperPlanePath(startX, startY, position.startX, position.startY),
    );
    setAnimKey((k) => k + 1);
  }, [menuItem]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    >
      {animKey > 0 && (
        <img
          key={animKey}
          src={mode === "Dark" ? LightPlane : DarkPlane}
          alt="Flying Plane"
          className="plane"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            offsetPath: `path('${path}')`,
            offsetRotate: "auto",
            animation:
              "flyAlongPath 5s cubic-bezier(0.25, 0.1, 0.2, 1) forwards",
          }}
        />
      )}
    </div>
  );
};

export default FlyingPlane;
