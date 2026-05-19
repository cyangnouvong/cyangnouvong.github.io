import { BackButton, ProjectHeader, ContributionsList } from "../BaseProject";
import { Button } from "@cyangnouvong/dao-ui";

import "../styles.css";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes";

const designUIContributions = [
  { label: "", detail: "Designed my own mini design system" },
];

const portfolioContributions = [{ label: "", detail: "Explored Three.js" }];

const PersonalProjects = () => {
  const navigate = useNavigate();
  return (
    <div className="project-page-container">
      <div className="project-layout project-layout--no-sidebar">
        <div className="right-col">
          <BackButton />
          <ProjectHeader
            title={"Personal Projects"}
            badgeTitles={["Frontend", "UI Design"]}
          />
          <hr className="section-rule" />

          <div className="lower">
            <ContributionsList
              title={"Design System"}
              keyContributions={designUIContributions}
            />
            <ContributionsList
              title={"Personal Portfolio"}
              keyContributions={portfolioContributions}
            />
            <div style={{ height: "30px", width: "200px" }}>
              <Button size="sm" onClick={() => navigate(PATHS.daoPixel)}>
                Pixel Animator
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="project-layout-mobile">
        <ProjectHeader
          title={"Personal Projects"}
          badgeTitles={["Frontend", "UI Design"]}
        />
        <hr className="section-rule" />
        <ContributionsList
          title={"Design System"}
          keyContributions={designUIContributions}
        />
        <ContributionsList
          title={"Personal Portfolio"}
          keyContributions={portfolioContributions}
        />
      </div>
    </div>
  );
};

export default PersonalProjects;
