import { useEffect, useState } from "react";
import "./styles.css";
import About from "../Content/About";
import Work from "../Content/Work";
import Contact from "../Content/Contact";

type DrawerProps = {
  project: number | null;
  active: boolean;
  setIsActive: (active: boolean) => void;
};

const pageMap: Record<number, React.ReactNode> = {
  0: <About />,
  1: <Work />,
  2: <Contact />,
};

const Drawer = ({ project, active, setIsActive }: DrawerProps) => {
  const [projectState, setProjectState] = useState(project);

  useEffect(() => {
    if (active) {
      setProjectState(project);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [active, project]);

  return (
    <div
      className="drawer-content"
      style={{
        transform: active ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "transparent",
          color: "#fff",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
        onClick={() => setIsActive(false)}
      >
        x
      </button>
      <div>{projectState !== null ? pageMap[projectState] : null}</div>
    </div>
  );
};

export default Drawer;
