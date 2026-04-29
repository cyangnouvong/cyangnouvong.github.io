import BaseProject from "../BaseProject";

const PersonalProjects = () => {
  const techs = ["React", "Typescript", "Three.js", "R3F"];
  return (
    <BaseProject
      title="Personal Projects"
      badgeTitles={["Frontend", "UI Design"]}
      introDescription="A collection of personal projects."
      techStack={techs}
      keyContributions={[]}
    />
  );
};

export default PersonalProjects;
