import BaseProject from "../BaseProject";

const techs = ["React", "TypeScript", "Redux", "Java", "SQL"];

const contributions: { label: string; detail: string }[] = [
  {
    label: "Entitlements Platform",
    detail:
      "Contributed to the full-stack development of a firmwide entitlements management platform, consolidating access request, recertification, and allocation workflows previously spread across separate systems into a single hub used across the firm.",
  },
  {
    label: "Bulk File Upload ",
    detail:
      "Built reusable UI components aligned to Goldman Sachs design standards, including a bulk file upload and parsing feature that eliminated manual one-by-one allocation, enabling managers to provision access for large employee groups in a single action.",
  },
  {
    label: "Design Collaboration ",
    detail:
      "Developed and presented new features and design implementations during internal team demos, and collaborated directly with UX designers to translate Figma specs into production-ready interfaces.",
  },
  {
    label: "API Development ",
    detail:
      "Developed backend API endpoints to support frontend features, including entitlement allocation logic and data validation.",
  },
  {
    label: "User Support ",
    detail:
      "Handled approximately 20 support tickets weekly during team rotation, serving as a direct point of contact for end users of 6+ business-critical applications",
  },
];

const description =
  "As a fullstack engineer on a small Agile team, I contributed to building a firmwide entitlements management platform that consolidated access request, recertification, and allocation workflows into a single hub used across the firm.";

const GoldmanSachs = () => {
  return (
    <BaseProject
      title="Goldman Sachs"
      badgeTitles={["Full Stack"]}
      introDescription={description}
      techStack={techs}
      keyContributions={contributions}
      metadata={[
        { label: "Team", value: "Identity and Access Management" },
        { label: "Duration", value: "November 2023 - March 2025" },
      ]}
    />
  );
};

export default GoldmanSachs;
