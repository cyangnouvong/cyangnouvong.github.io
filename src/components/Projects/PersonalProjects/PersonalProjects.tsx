import { BackButton, ProjectHeader, ContributionsList } from "../BaseProject";

import "../styles.css";

const designUIContributions = [
  { label: "", detail: "Designed my own mini design system" },
];

const portfolioContributions = [{ label: "", detail: "Explored Three.js" }];

const PersonalProjects = () => {
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
