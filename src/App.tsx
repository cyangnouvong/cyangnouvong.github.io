import DisplayMode from "./components/DisplayMode";
import IntroHeader from "./components/IntroHeader";
import NavMenu from "./components/NavMenu";
import Scene from "./components/Scene";

const App = () => {
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
        <IntroHeader />
        <NavMenu />
      </div>
      <DisplayMode />
    </div>
  );
};

export default App;
