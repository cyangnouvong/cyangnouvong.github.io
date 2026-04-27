export type Project = {
  title: string;
  description: string;
  link: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Goldman Sachs",
    description:
      "Collection of projects and experiences from my time at Goldman Sachs.",
    link: "/GoldmanSachs",
  },
  {
    title: "GeneHealth.AI",
    description:
      "A platform for genetic testing and personalized health insights.",
    link: "/GeneHealth",
  },
  {
    title: "Design System",
    description: "A personalized design system for consistent UI development.",
    link: "/DesignSystem",
  },
];
