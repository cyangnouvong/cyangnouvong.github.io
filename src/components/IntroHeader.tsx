const IntroHeader = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(12px, 3vh, 48px)",
        left: "clamp(16px, 2vw, 48px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
          }}
        >
          Chelsea Yangnouvong
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            color: "var(--ink-muted)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Frontend Developer
        </div>
      </div>
    </div>
  );
};

export default IntroHeader;
