import { useEffect } from "react";
import type { Project } from "../Projects";

interface DesignSystemProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}
const DesignSystem = ({ projects, setProjects }: DesignSystemProps) => {
  useEffect(() => {
    if (projects.some((p) => p.title === "Design System")) return;
    setProjects([
      ...projects,
      {
        title: "Design System",
        description:
          "A personalized design system for consistent UI development.",
      },
    ]);
  }, [projects, setProjects]);

  return (
    <>
      <></>
    </>
  );
};

export default DesignSystem;
