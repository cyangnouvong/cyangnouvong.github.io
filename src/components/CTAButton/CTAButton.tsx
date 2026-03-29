import { useState } from "react";
import useMountAnimation from "../../utils/useMountAnimation";
import { useWindowSize } from "../../utils/useWindowSize";
import "./styles.css";

const CTAButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useWindowSize();
  const mounted = useMountAnimation();

  return (
    <>
      <button
        style={
          {
            position: "absolute",
            top: isMobile
              ? "calc(70% - clamp(80px, 10vh, 120px) / 2)"
              : "calc(50% - clamp(80px, 10vh, 120px) / 2)",
            left: "clamp(40px, 10vw, 300px)",
            width: "clamp(200px, 15vw, 320px)",
            height: "clamp(60px, 8vh, 120px)",
            backgroundColor: "transparent",
            cursor: "pointer",
            border: "none",
            padding: 0,
            opacity: 0,
            zIndex: 2,
            animation: mounted
              ? "fadeUp 0.7s var(--curve) 1200ms forwards"
              : "none",
          } as React.CSSProperties
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Shadow layer */}
        <div
          style={{
            position: "absolute",
            width: "calc(100% - 10px)",
            height: "calc(100% - 10px)",
            bottom: isHovered ? "10px" : "0px",
            left: isHovered ? "10px" : "0px",
            backgroundColor: "var(--ink-faint)",
            transition: "bottom 0.3s ease-in-out, left 0.3s ease-in-out",
            zIndex: 0,
          }}
        />

        {/* Front face */}
        <div
          style={{
            position: "absolute",
            backgroundColor: "color-mix(in srgb, var(--bg) 70%, transparent)",
            backdropFilter: "blur(4px)",
            width: "calc(100% - 10px)",
            height: "calc(100% - 10px)",
            right: "0px",
            top: "0px",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "var(--text-sm)",
            letterSpacing: "0.12em",
            fontFamily: "var(--font-ui)",
            textTransform: "uppercase",
            border: "1px solid",
            borderColor: isHovered ? "var(--ink)" : "var(--ink-mid)",
            color: isHovered ? "var(--ink)" : "var(--ink-mid)",
            transition: "border-color 0.2s ease, color 0.2s ease",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4em",
            }}
          >
            See my work
            <span
              style={{
                display: "inline-block",
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.3s var(--curve)",
              }}
            >
              →
            </span>
          </span>
        </div>
      </button>
    </>
  );
};

export default CTAButton;
