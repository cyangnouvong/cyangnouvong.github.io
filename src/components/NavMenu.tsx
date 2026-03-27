import React from "react";

const MenuItem = ({ label }: { label: string }) => {
  return (
    <button
      type="button"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-base)",
        color: "var(--ink-mid)",
        transition: "color 0.3s ease",
        textAlign: "left",
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <span>{label}</span>
    </button>
  );
};
function onHover(e: React.MouseEvent<HTMLButtonElement>) {
  const target = e.currentTarget;
  target.style.color = "var(--ink-muted)";
  target.style.transform = "scale(1.05)";
}

function onLeave(e: React.MouseEvent<HTMLButtonElement>) {
  const target = e.currentTarget;
  target.style.color = "var(--ink-mid)";
  target.style.transform = "scale(1)";
}

const NavMenu = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(100px, 18vh, 200px)",
        left: "clamp(16px, 2vw, 48px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(12px, 2vh, 24px)",
        }}
      >
        {["About", "Work", "Contact"].map((label) => (
          <MenuItem key={label} label={label} />
        ))}
      </div>
    </div>
  );
};

export default NavMenu;
