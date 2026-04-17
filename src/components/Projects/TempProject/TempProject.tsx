import { useEffect } from "react";
import type { Project } from "../Projects";

interface TempProjectProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}
const TempProject = ({ projects, setProjects }: TempProjectProps) => {
  useEffect(() => {
    if (projects.some((p) => p.title === "Temp Project")) return;
    setProjects([
      ...projects,
      {
        title: "Temp Project",
        description: "A temporary project for testing purposes.",
      },
    ]);
  }, [projects, setProjects]);

  return (
    <>
      <></>
    </>
  );
};

export default TempProject;
