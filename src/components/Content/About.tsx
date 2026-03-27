import darkLogo from "../../assets/darkLogo.png";
import lightLogo from "../../assets/lightLogo.png";
import { useTheme } from "../../context/ThemeContext";

const About = () => {
  const { mode } = useTheme();

  return (
    <>
      <div>
        <img
          src={mode === "Dark" ? lightLogo : darkLogo}
          alt={"Logo"}
          style={{ width: "200px", height: "auto" }}
        />
      </div>
    </>
  );
};

export default About;
