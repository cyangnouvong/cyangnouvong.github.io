import BaseProject from "../BaseProject";

const techs = ["React", "TypeScript", "Laravel", "AWS S3", "SQL", "Figma"];

const contributions: { label: string; detail: string }[] = [
  {
    label: "Migrated frontend stack",
    detail:
      "Rebuilt the application from a Laravel Blade monolith to a React + TypeScript SPA, improving load performance, component reusability, and overall user experience.",
  },
  {
    label: "Built provider & member portals",
    detail:
      "Designed and developed responsive, accessible client portals end-to-end, from Figma design systems through to React implementation.",
  },
  {
    label: "Automated CI/CD pipeline",
    detail:
      "Engineered a GitHub Actions pipeline to automate deployments to a cPanel shared hosting environment, orchestrating build, packaging, SCP transfer, and remote Laravel bootstrapping to cut release time from over an hour to under 2 minutes.",
  },
  {
    label: "Database schema overhaul",
    detail:
      "Refactored the existing database to enforce relational integrity, introducing foreign keys, normalizing tables, and aligning the schema with SQL best practices.",
  },
  {
    label: "Cloud asset infrastructure",
    detail:
      "Integrated AWS S3 for scalable, reliable storage and delivery of application assets.",
  },
];

const description =
  "GeneHealth AI is a start up focused on providing genetic testing and insights using in house AI models. As the sole designer and fullstack engineer, I modernized the frontend stack and owned end-to-end development of all new features including backend API design, frontend implementation, and UX.";

const GeneHealth = () => {
  return (
    <BaseProject
      title="GeneHealth AI"
      badgeTitles={["Full Stack", "UI Design"]}
      introDescription={description}
      techStack={techs}
      keyContributions={contributions}
      metadata={[{ label: "Duration", value: "March 2025 - Present" }]}
    />
  );
};

export default GeneHealth;
