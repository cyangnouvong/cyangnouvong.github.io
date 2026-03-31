import { useState } from "react";
import CTAButton from "./components/CTAButton/CTAButton";
import DisplayMode from "./components/DisplayMode";
import IntroHeader from "./components/IntroHeader/IntroHeader";
import LogoReveal from "./components/LogoReveal/LogoReveal";
import Scene from "./components/Scene";
import SecondPage from "./components/SecondPage/SecondPage";
import { useWindowSize } from "./utils/useWindowSize";
import "./app.css";

const App = () => {
  const [, setLogoComplete] = useState(false);
  const { isMobile } = useWindowSize();

  const handleCTAClick = () => {
    const target = document.getElementById("second-page");
    if (!target) return;

    const scrollContainer = target.closest<HTMLElement>("[data-scroll-root]");
    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: target.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Border box */}
      <div className="border-box" data-scroll-root>
        {/* Animated background */}
        {/* <div className="home-scene"> */}
        <Scene />
        {/* </div> */}

        {/* UI Components */}
        <div className="ui-layer">
          <LogoReveal onComplete={() => setLogoComplete(true)} />
          <IntroHeader />
          <CTAButton
            style={{
              position: "absolute",
              top: isMobile
                ? "calc(80% - clamp(60px, 8vh, 120px) / 2)"
                : "calc(50% - clamp(60px, 8vh, 120px) / 2)",
              left: "clamp(40px, 10vw, 300px)",
              width: "clamp(200px, 15vw, 320px)",
              height: "clamp(60px, 8vh, 120px)",
            }}
            onClick={handleCTAClick}
          >
            See my work
          </CTAButton>
          <div className="transition-effect" />
        </div>
        <SecondPage />
      </div>
      <DisplayMode />
    </div>
  );
};

export default App;
