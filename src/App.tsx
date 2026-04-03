import { useState } from "react";
import { useWindowSize } from "./utils/useWindowSize";
import { Button } from "@cyangnouvong/dao-ui";

import useMountAnimation from "./utils/useMountAnimation";

import DisplayMode from "./components/DisplayMode";
import IntroHeader from "./components/IntroHeader/IntroHeader";
import LogoReveal from "./components/LogoReveal/LogoReveal";
import Scene from "./components/Topography/Scene";
import SecondPage from "./components/SecondPage/SecondPage";

import "./app.css";

const App = () => {
  const [, setLogoComplete] = useState(false);
  const { isMobile } = useWindowSize();
  const mounted = useMountAnimation();

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

  const seeWorkButton = () => {
    return (
      <div
        className={"see-work-button " + (isMobile ? "see-work--mobile" : "")}
        style={{
          animation: mounted
            ? `fadeIn ${0.7}s var(--curve) ${1200}ms forwards`
            : "none",
        }}
      >
        <Button
          variant="emphasis"
          showArrow={true}
          size={"sm"}
          onClick={handleCTAClick}
        >
          See my work
        </Button>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="border-box" data-scroll-root>
        <Scene />
        <div className="ui-layer">
          <LogoReveal onComplete={() => setLogoComplete(true)} />
          <IntroHeader />
          {seeWorkButton()}
        </div>
        <SecondPage />
      </div>
      <DisplayMode />
    </div>
  );
};

export default App;
