import { useState } from "react";
import { useWindowSize } from "../../utils/useWindowSize";
import { Button, DotIndicator, Text } from "@cyangnouvong/dao-ui";

import useInView from "../../utils/useInView";
import ProjectCards from "../ProjectCards/ProjectCards";

import "./styles.css";

interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
  animationClass?: string;
  time?: number;
  styles?: React.CSSProperties;
}

const AnimatedItem = ({
  children,
  delay = 0,
  inView,
  animationClass = "fadeUp",
  time = 0.8,
  styles = {},
}: AnimatedItemProps) => (
  <div
    style={{
      opacity: 0,
      animation: inView
        ? `${animationClass} ${time}s var(--curve) ${delay}ms forwards`
        : "none",
      ...styles,
    }}
  >
    {children}
  </div>
);

const PROJECTS: { title: string; description: string }[] = [
  { title: "Project one", description: "Description 1" },
  { title: "Design System", description: "Description 2" },
  { title: "Project three", description: "Description 3" },
];

interface OverlayProps {
  inView: boolean;
  active: number | null;
  setActive: (active: number | null) => void;
  isPortrait: boolean;
}

const Overlay = ({ inView, active, setActive, isPortrait }: OverlayProps) => {
  const proj = active != null ? PROJECTS[active] : null;

  return (
    <div className="canvas-overlay">
      <AnimatedItem inView={inView} delay={80} animationClass="fadeIn">
        <Text
          font="ui"
          size="xs"
          tracking="wide"
          style={{
            color: "rgba(228, 228, 223, 0.4)",
            textTransform: "uppercase",
          }}
        >
          Selected works
        </Text>
      </AnimatedItem>

      <div className="overlay-bottom">
        <div className="overlay-bottom-left">
          <AnimatedItem inView={inView} delay={160} animationClass="fadeUp">
            <Text
              font="ui"
              size="xs"
              tracking="wide"
              style={{ color: "rgba(228, 228, 223, 0.4)" }}
            >
              {active != null ? String(active + 1).padStart(2, "0") : "—"}
              {" / "}
              {String(PROJECTS.length).padStart(2, "0")}
            </Text>
          </AnimatedItem>

          <AnimatedItem inView={inView} delay={220} animationClass="fadeUp">
            <Text font="display" size="xxl" style={{ color: "#e4e4df" }}>
              {proj ? proj.title : "Things I've built"}
            </Text>
          </AnimatedItem>

          <AnimatedItem inView={inView} delay={300} animationClass="fadeUp">
            <Text
              font="ui"
              size="base"
              style={{
                lineHeight: "1.55",
                margin: "0 0 0.75rem",
                color: "rgba(228, 228, 223, 0.6)",
              }}
            >
              {proj
                ? proj.description
                : isPortrait
                  ? "Swipe to explore."
                  : "Tap a card to see details."}
            </Text>
          </AnimatedItem>

          <AnimatedItem inView={inView} delay={380} animationClass="fadeUp">
            <div
              style={{
                width: "clamp(180px, 30vw, 220px)",
                height: "clamp(50px, 6vh, 64px)",
              }}
            >
              <Button variant="emphasis" showArrow={true} size={"sm"}>
                View project
              </Button>
            </div>
          </AnimatedItem>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <DotIndicator
            count={PROJECTS.length}
            active={active}
            direction={isPortrait ? "horizontal" : "vertical"}
            onChange={(i) => setActive(i)}
          />
        </div>
      </div>
    </div>
  );
};

interface MobilePageProps {
  pageRef: React.Ref<HTMLDivElement>;
  inView: boolean;
  active: number | null;
  setActive: (active: number | null) => void;
  isPortrait: boolean;
  handleClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MobilePage = ({
  pageRef,
  inView,
  active,
  setActive,
  isPortrait,
  handleClick,
}: MobilePageProps) => (
  <div ref={pageRef} className="second-page-mobile" id="second-page">
    <div className="canvas-frame" onClick={handleClick}>
      <ProjectCards active={active} setActive={setActive} inView={inView} />
      <Overlay
        inView={inView}
        active={active}
        setActive={setActive}
        isPortrait={isPortrait}
      />
    </div>
  </div>
);

interface DesktopPageProps {
  inView: boolean;
  active: number | null;
  setActive: (active: number | null) => void;
  isPortrait: boolean;
}

const DesktopPage = ({
  inView,
  active,
  setActive,
  isPortrait,
}: DesktopPageProps) => (
  <div className="second-page" id="second-page">
    <AnimatedItem
      inView={inView}
      delay={0}
      animationClass="fadeIn"
      styles={{ width: "100%", height: "100%" }}
    >
      <div className="canvas-frame">
        <ProjectCards active={active} setActive={setActive} inView={inView} />
        <Overlay
          inView={inView}
          active={active}
          setActive={setActive}
          isPortrait={isPortrait}
        />
      </div>
    </AnimatedItem>
  </div>
);

const SecondPage = () => {
  const { ref, inView } = useInView(0.1);
  const { isMobile, width, height } = useWindowSize();
  const isPortrait = height > width;
  const [active, setActive] = useState<number | null>(isPortrait ? 0 : 1);

  const handleSetActive = (next: number | null) => {
    if (isMobile && next === null) return;
    setActive(next);
  };

  const handleMobileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left; // position inside container
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
      setActive((prev) => {
        if (prev === null) return 0;
        return prev > 0 ? prev - 1 : prev;
      });
    } else {
      setActive((prev) => {
        if (prev === null) return 0;
        return prev < PROJECTS.length - 1 ? prev + 1 : prev;
      });
    }
  };

  return isMobile ? (
    <MobilePage
      pageRef={ref}
      inView={inView}
      active={active}
      setActive={handleSetActive}
      isPortrait={isPortrait}
      handleClick={handleMobileClick}
    />
  ) : (
    <div ref={ref}>
      <DesktopPage
        inView={inView}
        active={active}
        setActive={setActive}
        isPortrait={isPortrait}
      />
    </div>
  );
};

export default SecondPage;
