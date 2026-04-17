import { useEffect } from "react";
import type { Project } from "../Projects";

interface GeneHealthProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}
const GeneHealth = ({ projects, setProjects }: GeneHealthProps) => {
  useEffect(() => {
    if (projects.some((p) => p.title === "GeneHealth.AI")) return;
    setProjects([
      ...projects,
      {
        title: "GeneHealth.AI",
        description:
          "A platform for genetic testing and personalized health insights.",
      },
    ]);
  }, [projects, setProjects]);

  return (
    <>
      <></>
    </>
  );
};

export default GeneHealth;
