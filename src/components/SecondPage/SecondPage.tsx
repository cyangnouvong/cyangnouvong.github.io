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

const PROJECT_DESCRIPTIONS: Record<number, string> = {
  0: "Description 1",
  1: "Description 2",
  2: "Description 3",
};

const ProjectDescription = (active: number | null) =>
  active != null ? PROJECT_DESCRIPTIONS[active] : "Tap a card to see details.";

interface PageProps {
  inView: boolean;
  active: number | null;
  setActive: (active: number | null) => void;
  projectView: boolean;
  setProjectView: (active: boolean) => void;
}

interface MobilePageProps extends PageProps {
  pageRef: React.RefObject<HTMLDivElement | null>;
}

const MobilePage = ({
  pageRef,
  inView,
  active,
  setActive,
  projectView,
  setProjectView,
}: MobilePageProps) => {
  return (
    <div ref={pageRef} className="second-page-mobile" id="second-page">
      <Drawer
        project={active}
        active={projectView}
        setIsActive={(view) => setProjectView(view)}
      />
      {/* Header */}
      <div className="mobile-header">
        <AnimatedItem inView={inView} delay={80}>
          <p className="label">Selected works</p>
        </AnimatedItem>
        <AnimatedItem inView={inView} delay={180}>
          <h2 className="heading">Things I've built</h2>
        </AnimatedItem>
        <AnimatedItem
          inView={inView}
          delay={300}
          animationClass="grow"
          time={2}
        >
          <div className="secondary-divider" />
        </AnimatedItem>
      </div>

      {/* Single canvas with all 3 cards */}
      <AnimatedItem inView={inView} delay={0} animationClass="fadeIn">
        <div className="mobile-cards-wrapper">
          <ProjectCards
            active={active}
            setActive={setActive}
            inView={inView}
            isSquare={true}
          />
        </div>
      </AnimatedItem>

      {/* Description + CTA below cards */}
      <div className="mobile-footer">
        <AnimatedItem inView={inView} delay={180}>
          <p className="description">{ProjectDescription(active)}</p>
        </AnimatedItem>
        <AnimatedItem inView={inView} delay={300}>
          <CTAButton
            animationDelay={500}
            style={{
              width: "clamp(160px, 40vw, 260px)",
              height: "clamp(48px, 7vh, 80px)",
            }}
            onClick={() => setProjectView(true)}
          >
            View Project
          </CTAButton>
        </AnimatedItem>
      </div>
    </div>
  );
};

const DesktopPage = ({
  inView,
  active,
  setActive,
  projectView,
  setProjectView,
}: PageProps) => {
  return (
    <div className="second-page" id="second-page">
      <Drawer
        project={active}
        active={projectView}
        setIsActive={(view) => setProjectView(view)}
      />
      <div
        style={{
          flex: "1 1 60%",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div style={{ height: "100%", minHeight: 0 }}>
          <AnimatedItem
            inView={inView}
            delay={0}
            animationClass="fadeIn"
            styles={{ height: "100%" }}
          >
            <ProjectCards
              active={active}
              setActive={setActive}
              inView={inView}
              isSquare={false}
            />
          </AnimatedItem>
        </div>
      </div>
      <div
        style={{
          flex: "1 1 40%",
          display: "flex",
          height: "clamp(500px, 50vh, 800px)",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
          minHeight: 0,
          gap: "0",
        }}
      >
        <AnimatedItem inView={inView} delay={80}>
          <p className="label">Selected works</p>
        </AnimatedItem>
        <AnimatedItem inView={inView} delay={180}>
          <h2 className="heading">Things I've built</h2>
        </AnimatedItem>
        <AnimatedItem
          inView={inView}
          delay={300}
          animationClass="grow"
          time={2}
        >
          <div className="secondary-divider" />
        </AnimatedItem>
        <AnimatedItem inView={inView} delay={180}>
          <p className="description">{ProjectDescription(active)}</p>
        </AnimatedItem>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <AnimatedItem inView={inView} delay={0}>
            <CTAButton
              animationDelay={500}
              style={{
                width: "clamp(160px, 40vw, 260px)",
                height: "clamp(48px, 7vh, 80px)",
              }}
              onClick={() => setProjectView(true)}
            >
              View Project
            </CTAButton>
          </AnimatedItem>
        </div>
      </div>
    </div>
  );
};

const SecondPage = () => {
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState<number | null>(1);
  const { isMobile } = useWindowSize();
  const [projectView, setProjectView] = useState<boolean>(false);

  return (
    <>
      <div ref={ref}>
        {isMobile ? (
          <MobilePage
            pageRef={ref}
            inView={inView}
            active={active}
            setActive={setActive}
            projectView={projectView}
            setProjectView={setProjectView}
          />
        ) : (
          <DesktopPage
            inView={inView}
            active={active}
            setActive={setActive}
            projectView={projectView}
            setProjectView={(page) => setProjectView(page)}
          />
        )}
      </div>
    </>
  );
};

export default SecondPage;
