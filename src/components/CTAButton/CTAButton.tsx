import React, { useState } from "react";

import useMountAnimation from "../../utils/useMountAnimation";
import "./styles.css";

type CTAButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  animationDelay?: number;
  animationTime?: number;
};

const CTAButton = ({
  children,
  onClick,
  style,
  className = "",
  animationDelay = 1200,
  animationTime = 0.7,
}: CTAButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const mounted = useMountAnimation();

  return (
    <button
      className={"cta-button " + (isHovered ? "hovered" : "") + " " + className}
      style={{
        animation: mounted
          ? `fadeIn ${animationTime}s var(--curve) ${animationDelay}ms forwards`
          : "none",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cta-shadow" />
      <div className="cta-front">
        <span className="cta-content">
          {children}
          <span className="cta-arrow">→</span>
        </span>
      </div>
    </button>
  );
};

export default CTAButton;
