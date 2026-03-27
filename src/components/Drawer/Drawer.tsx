import { useEffect, useRef, useState } from "react";
import "./styles.css";
import FlyingPlane from "../FlyingPlane/FlyingPlane";
import About from "../Content/About";
import Work from "../Content/Work";
import Contact from "../Content/Contact";

type DrawerProps = {
  menuItem: string;
};

const pageMap: Record<string, React.ReactNode> = {
  About: <About />,
  Work: <Work />,
  Contact: <Contact />,
};

const Drawer = ({ menuItem }: DrawerProps) => {
  const [menuState, setMenuState] = useState(menuItem);
  const [isActive, setIsActive] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const drawerRect = ref.current.getBoundingClientRect();
      setStartPosition({
        x: drawerRect.left, // ← left edge of the drawer (not negated)
        y: drawerRect.top + drawerRect.height / 2, // ← vertically centered
      });
    }

    if (menuState !== menuItem) {
      if (menuState === "Home") {
        setMenuState(menuItem);
        setIsActive(true);
      } else {
        setIsActive(false);

        const timeout = setTimeout(() => {
          setMenuState(menuItem);
          setIsActive(true);
        }, 800); // slightly longer than the CSS transition duration so the drawer doesn't pop out immediately
        return () => clearTimeout(timeout);
      }
    }
  }, [menuItem]);

  return (
    <>
      <div ref={ref} className="drawer-holder">
        <FlyingPlane
          menuItem={menuItem}
          position={{
            startX: startPosition.x,
            startY: startPosition.y,
          }}
        />
      </div>
      <div
        className="drawer-content"
        style={{ transform: isActive ? "translateX(0)" : "translateX(100%)" }}
      >
        <div>{pageMap[menuState]}</div>
      </div>
    </>
  );
};

export default Drawer;
