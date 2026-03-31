import { useState } from "react";
import useInView from "../../utils/useInView";
import ProjectCards from "../ProjectCards/ProjectCards";
import "./styles.css";
import CTAButton from "../CTAButton/CTAButton";

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

const ProjectDescription = (active: number | null) => {
  switch (active) {
    case 0:
      return "Description 1";
    case 1:
      return "Description 2";
    case 2:
      return "Description 3";
    default:
      return "Click on a project card to see the description.";
  }
};

const SecondPage = () => {
  const { ref, inView } = useInView(0.1);
  const [active, setActive] = useState<number | null>(1);

  return (
    <div ref={ref} className="second-page" id="second-page">
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
        <div
          style={{
            height: "100%",
            minHeight: 0,
          }}
        >
          <AnimatedItem
            inView={inView}
            delay={0}
            animationClass="fadeIn"
            styles={{ height: "100%" }}
          >
            {ProjectCards(active, setActive, inView)}
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
          <p className="label">Selected work</p>
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
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <AnimatedItem inView={inView} delay={0}>
            <CTAButton
              animationDelay={500}
              style={{
                width: "clamp(200px, 15vw, 320px)",
                height: "clamp(60px, 8vh, 120px)",
              }}
              onClick={() => console.log("View project clicked!")}
            >
              View Project
            </CTAButton>
          </AnimatedItem>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
