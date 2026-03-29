import { useState } from "react";
import CTAButton from "./components/CTAButton/CTAButton";
import DisplayMode from "./components/DisplayMode";
import IntroHeader from "./components/IntroHeader/IntroHeader";
import LogoReveal from "./components/LogoReveal/LogoReveal";
import Scene from "./components/Scene";

const App = () => {
  const [logoComplete, setLogoComplete] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Border box */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          margin: "var(--margin-y) var(--margin-x)",
          border: "1px solid var(--ink-muted)",
          overflow: "hidden",
        }}
      >
        {/* Animated background */}
        <Scene />

        {/* UI Components */}
        <LogoReveal onComplete={() => setLogoComplete(true)} />
        <IntroHeader />
        <CTAButton />
      </div>
      <DisplayMode />
    </div>
  );
};

export default App;
