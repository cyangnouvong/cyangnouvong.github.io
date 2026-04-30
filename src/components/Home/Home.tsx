import { Button } from "@cyangnouvong/dao-ui";
import Scene from "../Topography/Scene";
import IntroHeader from "../IntroHeader/IntroHeader";
import LogoReveal from "../LogoReveal/LogoReveal";
import SecondPage from "../SecondPage/SecondPage";

interface HomeProps {
  onLogoComplete: () => void;
  isMobile: boolean;
  mounted: boolean;
}

const Home = ({ onLogoComplete, isMobile, mounted }: HomeProps) => {
  const handleCTAClick = () => {
    const target = document.getElementById("selected-works");
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Scene />
      <div className="ui-layer">
        <LogoReveal onComplete={onLogoComplete} />
        <IntroHeader />
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
      </div>
      <SecondPage />
    </>
  );
};

export default Home;
