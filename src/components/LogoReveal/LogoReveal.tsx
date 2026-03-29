import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import DarkLogo from "../../assets/darkLogo.png";
import LightLogo from "../../assets/lightLogo.png";
import { useWindowSize } from "../../utils/useWindowSize";
import "./styles.css";

const LogoReveal = ({ onComplete }: { onComplete?: () => void }) => {
  const [mounted, setMounted] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const { mode } = useTheme();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!mounted || !onComplete) {
      return;
    }
    const animationDuration = 1800; // Total duration of the longest animation (in ms)
    const id = setTimeout(onComplete, 1700);
    const animationEndId = setTimeout(
      () => setAnimationDone(true),
      animationDuration,
    );
    return () => {
      clearTimeout(id);
      clearTimeout(animationEndId);
    };
  }, [mounted, onComplete]);

  const logo = mode === "Light" ? DarkLogo : LightLogo;
  const size = isMobile
    ? "clamp(200px, 60vw, 280px)"
    : "clamp(280px, 35vw, 480px)";

  return (
    <>
      <div
        style={{
          position: "absolute",
          ...(isMobile
            ? {
                top: "33%",
                left: "60%",
                transform: "translateX(-50%)",
              }
            : {
                top: "50%",
                right: "clamp(40px, 6vw, 120px)",
                transform: "translateY(-50%)",
              }),
          width: size,
          height: size,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {!animationDone && (
          <>
            <svg
              viewBox="0 0 340 340"
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "center",
                transform: "scale(0)",
                opacity: 0,
                animation: mounted
                  ? "scaleCircle 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 100ms forwards"
                  : "none",
              }}
            >
              <circle
                cx="170"
                cy="170"
                r="160"
                fill="var(--ink-faint)"
                opacity="0.3"
              />
            </svg>
            <svg
              viewBox="0 0 340 340"
              width="100%"
              height="100%"
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "center",
                transform: "scale(0)",
                opacity: 0,
                animation: mounted
                  ? "scaleCircle 1.6s cubic-bezier(0.25, 0.1, 0.25, 1) 200ms forwards"
                  : "none",
              }}
            >
              <circle cx="170" cy="170" r="160" fill="var(--bg)" opacity="1" />
            </svg>
          </>
        )}
        <img
          src={logo}
          alt="Logo"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0,
            animation: mounted
              ? "logoFade 1s cubic-bezier(0, 0, 1, 1) 750ms forwards"
              : "none",
          }}
        />
      </div>
    </>
  );
};

export default LogoReveal;
