import React, { useState } from "react";
import Drawer from "./Drawer/Drawer";

const MenuItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick: (menuItem: string) => void;
}) => {
  const [hover, setHover] = useState(false);

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
        color: hover ? "var(--ink-muted)" : "var(--ink-mid)",
        transition: "color 0.3s ease",
        transform: hover ? "scale(1.05)" : "scale(1)",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export const menuItems = ["About", "Work", "Contact"];

const NavMenu = () => {
  const [activeItem, setActiveItem] = React.useState<string>("Home");

  const handleClick = (label: string) => {
    setActiveItem(label);
  };

  return (
    <>
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
          {menuItems.map((label) => (
            <MenuItem
              key={label}
              label={label}
              onClick={() => handleClick(label)}
            />
          ))}
        </div>
      </div>
      <Drawer menuItem={activeItem} />
    </>
  );
};

export default NavMenu;
