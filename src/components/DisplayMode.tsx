import { useTheme } from "../context/ThemeContext";
import { useWindowSize } from "../utils/useWindowSize";
import { RadioGroup } from "@cyangnouvong/dao-ui";

const DisplayMode = () => {
  const { mode, setMode } = useTheme();
  const { isMobile } = useWindowSize();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--margin-y)",
        left: "var(--margin-x)",
        transform: isMobile
          ? "translateY(100%) translateX(5%)"
          : "translateY(-50%) rotate(-90deg)",
        transformOrigin: "left bottom",
        display: "flex",
      }}
    >
      <RadioGroup
        options={[
          { label: "Light", value: "Light" },
          { label: "Dark", value: "Dark" },
        ]}
        value={mode}
        onChange={(value) => setMode(value)}
        size={"sm"}
      />
    </div>
  );
};

export default DisplayMode;
