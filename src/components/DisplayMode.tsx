import { useTheme } from "../context/ThemeContext";
import { useWindowSize } from "../utils/useWindowSize";

interface ButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Button = ({ label, active, onClick }: ButtonProps) => {
  const color = active ? "var(--ink-mid)" : "var(--ink-muted)";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-mid)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = color)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--text-xs)",
        color,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        padding: "4px 0",
        textAlign: "left",
        transition: "color 0.2s",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          border: "1px solid currentColor",
          backgroundColor: active ? "currentColor" : "transparent",
          transition: "background-color 0.4s",
        }}
      />
      <span>{label}</span>
    </button>
  );
};

const DisplayMode = () => {
  const { mode, setMode } = useTheme();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--margin-y)",
        left: "var(--margin-x)",
        transform: isMobile
          ? "translateY(100%) translateX(5%)"
          : "translateY(-50%) rotate(-90deg)",
        transformOrigin: "left bottom",
        display: "flex",
        gap: isMobile ? "16px" : "8px",
      }}
    >
      {["Light", "Dark"].map((activeState) => (
        <Button
          key={activeState}
          label={activeState}
          active={mode === activeState}
          onClick={() => setMode(activeState as "Light" | "Dark")}
        />
      ))}
    </div>
  );
};

export default DisplayMode;
