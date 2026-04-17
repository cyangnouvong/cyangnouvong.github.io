import { useState } from "react";
import GeneHealth from "./GeneHealth/GeneHealth";
import DesignSystem from "./DesignSystem/DesignSystem";
import TempProject from "./TempProject/TempProject";

export type Project = {
  title: string;
  description: string;
};

function Projects(): Project[] {
  const [projects, setProjects] = useState<Project[]>([]);

  TempProject({ projects, setProjects }); // 3
  GeneHealth({ projects, setProjects }); // 2
  DesignSystem({ projects, setProjects }); // 1

  return projects;
}

export default Projects;
