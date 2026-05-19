import type { ComponentType } from "react";

import GeneHealth from "./components/Projects/GeneHealth/GeneHealth";
import GoldmanSachs from "./components/Projects/GoldmanSachs/GoldmanSachs";
import PersonalProjects from "./components/Projects/PersonalProjects/PersonalProjects";
import PixelAnimator from "./components/PixelAnimator/PixelAnimator";

export const PATHS = {
  home: "/",
  geneHealth: "/GeneHealth",
  goldmanSachs: "/GoldmanSachs",
  personalProjects: "/PersonalProjects",
  daoPixel: "/PersonalProjects/daoPixel",
} as const;

type AppPath = (typeof PATHS)[keyof typeof PATHS];

export interface RouteConfig {
  path: AppPath;
  component: ComponentType;
}

export const PixelAnimate = PixelAnimator;

export const routes: RouteConfig[] = [
  {
    path: PATHS.geneHealth,
    component: GeneHealth,
  },
  {
    path: PATHS.personalProjects,
    component: PersonalProjects,
  },
  {
    path: PATHS.goldmanSachs,
    component: GoldmanSachs,
  },
];
