import { useEffect, useState } from "react";
import { Text } from "@cyangnouvong/dao-ui";
import "./styles.css";

const IntroHeader = ({ revealAfterMs = 0 }: { revealAfterMs?: number }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(
      () => requestAnimationFrame(() => setMounted(true)),
      revealAfterMs,
    );
    return () => clearTimeout(id);
  }, [revealAfterMs]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "clamp(12px, 3vh, 48px)",
          left: "clamp(16px, 2vw, 48px)",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Text
            font="display"
            size="xl"
            style={{
              clipPath: "inset(100% 0 0 0)",
              opacity: 0,
              animation: mounted
                ? "clipReveal 2s var(--curve) 60ms forwards"
                : "none",
            }}
          >
            Chelsea Yangnouvong
          </Text>
          <Text
            font="display"
            color="ink-muted"
            size="base"
            tracking="wider"
            style={{
              textTransform: "uppercase",
              opacity: 0,
              animation: mounted
                ? "subtitleReveal 1s var(--curve) 940ms forwards"
                : "none",
            }}
          >
            Full Stack Developer & Designer
          </Text>
        </div>
      </div>
    </>
  );
};

export default IntroHeader;
