import { useState } from "react";
import useInView from "../../utils/useInView";
import ProjectCards from "../ProjectCards/ProjectCards";
import "./styles.css";
import CTAButton from "../CTAButton/CTAButton";
import { useWindowSize } from "../../utils/useWindowSize";

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
  setActive: (active: number | null) => void;
  isPortrait: boolean;
}

const Overlay = ({ inView, active, setActive, isPortrait }: OverlayProps) => {
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
                : isPortrait
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
              onClick={
                () =>
                  console.log("View project") /* TODO: implement project view */
              }
            >
              View Project
            </CTAButton>
          </AnimatedItem>
        </div>

        <div className={"overlay-right"}>
          <div className="overlay-dots">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                className={`overlay-dot${active === i ? " overlay-dot--active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                aria-label={`View ${PROJECTS[i].title}`}
                aria-pressed={active === i}
              />
            ))}
          </div>
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
  projectView: boolean;
  setProjectView: (v: boolean) => void;
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
  projectView: boolean;
  setProjectView: (v: boolean) => void;
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
  const [projectView, setProjectView] = useState<boolean>(false);

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
      projectView={projectView}
      setProjectView={setProjectView}
      isPortrait={isPortrait}
      handleClick={handleMobileClick}
    />
  ) : (
    <div ref={ref}>
      <DesktopPage
        inView={inView}
        active={active}
        setActive={setActive}
        projectView={projectView}
        setProjectView={setProjectView}
        isPortrait={isPortrait}
      />
    </div>
  );
};

export default SecondPage;
