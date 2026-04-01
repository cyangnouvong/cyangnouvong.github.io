import { useState } from "react";
import useInView from "../../utils/useInView";
import ProjectCards from "../ProjectCards/ProjectCards";
import "./styles.css";
import CTAButton from "../CTAButton/CTAButton";
import { useWindowSize } from "../../utils/useWindowSize";
import Drawer from "../Drawer/Drawer";

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
    key={inView ? "in" : "out"}
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
  { title: "Project two", description: "Description 2" },
  { title: "Project three", description: "Description 3" },
];

interface OverlayProps {
  inView: boolean;
  active: number | null;
  onViewProject: () => void;
  isMobile: boolean;
}

const Overlay = ({ inView, active, onViewProject, isMobile }: OverlayProps) => {
  const proj = active != null ? PROJECTS[active] : null;

  return (
    <div className="canvas-overlay">
      <AnimatedItem inView={inView} delay={80} animationClass="fadeIn">
        <p className="label overlay-label">Selected works</p>
      </AnimatedItem>

      <div className="overlay-bottom">
        <div className="overlay-bottom-left">
          <AnimatedItem inView={inView} delay={160} animationClass="fadeUp">
            <p className="overlay-counter">
              {active != null ? String(active + 1).padStart(2, "0") : "—"}
              {" / "}
              {String(PROJECTS.length).padStart(2, "0")}
            </p>
          </AnimatedItem>

          <AnimatedItem inView={inView} delay={220} animationClass="fadeUp">
            <h2 className="overlay-title">
              {proj ? proj.title : "Things I've built"}
            </h2>
          </AnimatedItem>

          <AnimatedItem inView={inView} delay={300} animationClass="fadeUp">
            <p className="overlay-desc">
              {proj
                ? proj.description
                : isMobile
                  ? "Swipe to explore."
                  : "Tap a card to see details."}
            </p>
          </AnimatedItem>

          <AnimatedItem inView={inView} delay={380} animationClass="fadeUp">
            <CTAButton
              animationDelay={500}
              style={{
                width: "clamp(180px, 30vw, 220px)",
                height: "clamp(50px, 6vh, 64px)",
              }}
              onClick={onViewProject}
            >
              View Project
            </CTAButton>
          </AnimatedItem>
        </div>

        <div className="overlay-dots">
          {PROJECTS.map((_, i) => (
            <span
              key={i}
              className={`overlay-dot${active === i ? " overlay-dot--active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface MobilePageProps {
  pageRef: React.RefObject<HTMLDivElement | null>;
  inView: boolean;
  active: number | null;
  setActive: (active: number | null) => void;
  projectView: boolean;
  setProjectView: (v: boolean) => void;
}

const MobilePage = ({
  pageRef,
  inView,
  active,
  setActive,
  projectView,
  setProjectView,
}: MobilePageProps) => (
  <div ref={pageRef} className="second-page-mobile" id="second-page">
    <Drawer
      project={active}
      active={projectView}
      setIsActive={(v) => setProjectView(v)}
    />
    <div className="canvas-frame">
      <ProjectCards active={active} setActive={setActive} inView={inView} />
      <Overlay
        inView={inView}
        active={active}
        onViewProject={() => setProjectView(true)}
        isMobile={true}
      />
    </div>
  </div>
);

interface DesktopPageProps {
  inView: boolean;
  active: number | null;
  setActive: (active: number | null) => void;
  projectView: boolean;
  setProjectView: (v: boolean) => void;
}

const DesktopPage = ({
  inView,
  active,
  setActive,
  projectView,
  setProjectView,
}: DesktopPageProps) => (
  <div className="second-page" id="second-page">
    <Drawer
      project={active}
      active={projectView}
      setIsActive={(v) => setProjectView(v)}
    />
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
          onViewProject={() => setProjectView(true)}
          isMobile={false}
        />
      </div>
    </AnimatedItem>
  </div>
);

const SecondPage = () => {
  const { ref, inView } = useInView(0.1);
  const { isMobile } = useWindowSize();
  const [active, setActive] = useState<number | null>(isMobile ? 0 : 1);
  const [projectView, setProjectView] = useState<boolean>(false);

  const handleSetActive = (next: number | null) => {
    if (isMobile && next === null) return;
    setActive(next);
  };

  return isMobile ? (
    <MobilePage
      pageRef={ref}
      inView={inView}
      active={active}
      setActive={handleSetActive}
      projectView={projectView}
      setProjectView={setProjectView}
    />
  ) : (
    <div ref={ref}>
      <DesktopPage
        inView={inView}
        active={active}
        setActive={setActive}
        projectView={projectView}
        setProjectView={setProjectView}
      />
    </div>
  );
};

export default SecondPage;
