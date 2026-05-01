import { useState, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "./utils/useWindowSize";

import GeneHealth from "./components/Projects/GeneHealth/GeneHealth";
import PersonalProjects from "./components/Projects/PersonalProjects/PersonalProjects";
import GoldmanSachs from "./components/Projects/GoldmanSachs/GoldmanSachs";

import Home from "./components/Home/Home";

import useMountAnimation from "./utils/useMountAnimation";
import DisplayMode from "./components/DisplayMode";

import "./app.css";
import PixelAnimator from "./components/PixelAnimator/PixelAnimator";

const transition = { duration: 0.35, ease: "easeInOut" } as const;
const style = {
  position: "absolute" as const,
  inset: 0,
  overflowY: "auto" as const,
};

const PageWrapper = ({
  children,
  skipAnimation,
  direction,
}: {
  children: React.ReactNode;
  skipAnimation: boolean;
  direction?: "forward" | "backward";
}) => (
  <motion.div
    initial={
      skipAnimation ? false : { x: direction === "forward" ? "100%" : "-100%" }
    }
    animate={{ x: 0 }}
    exit={{ x: direction === "forward" ? "-100%" : "100%" }}
    transition={transition}
    style={style}
  >
    {children}
  </motion.div>
);

const App = () => {
  const [, setLogoComplete] = useState(false);
  const { isMobile } = useWindowSize();
  const mounted = useMountAnimation();
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setDirection(location.pathname === "/" ? "forward" : "backward");
  }, [location.pathname]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className={location.pathname === "/daoPixel" ? "" : "border-box"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/daoPixel" element={<PixelAnimator />} />
            <Route
              path="/"
              element={
                <PageWrapper
                  skipAnimation={isFirstRender.current}
                  direction={direction}
                >
                  <Home
                    onLogoComplete={() => setLogoComplete(true)}
                    isMobile={isMobile}
                    mounted={mounted}
                  />
                </PageWrapper>
              }
            />
            <Route
              path="/GeneHealth"
              element={
                <PageWrapper
                  skipAnimation={isFirstRender.current}
                  direction={direction}
                >
                  <GeneHealth />
                </PageWrapper>
              }
            />
            <Route
              path="/PersonalProjects"
              element={
                <PageWrapper
                  skipAnimation={isFirstRender.current}
                  direction={direction}
                >
                  <PersonalProjects />
                </PageWrapper>
              }
            />
            <Route
              path="/GoldmanSachs"
              element={
                <PageWrapper skipAnimation={isFirstRender.current}>
                  <GoldmanSachs />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <DisplayMode />
    </div>
  );
};

export default App;
