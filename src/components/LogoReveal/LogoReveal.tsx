import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import DarkLogo from "../../assets/darkLogo.png";
import LightLogo from "../../assets/lightLogo.png";
import { useWindowSize } from "../../utils/useWindowSize";
import "./styles.css";

const LogoReveal = ({ onComplete }: { onComplete?: () => void }) => {
  const [mounted, setMounted] = useState(false);
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
    const id = setTimeout(onComplete, 1700);
    return () => {
      clearTimeout(id);
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
                right: "clamp(40px, 10vw, 300px)",
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
          <defs>
            <filter id="glow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="5"
                floodColor="var(--accent)"
                floodOpacity="1"
              />
            </filter>
          </defs>
          <circle
            cx="170"
            cy="170"
            r="160"
            fill="var(--accent)"
            opacity="1"
            filter="url(#glow)"
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
          <circle cx="170" cy="170" r="160" fill="var(--bg)" />
        </svg>
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
