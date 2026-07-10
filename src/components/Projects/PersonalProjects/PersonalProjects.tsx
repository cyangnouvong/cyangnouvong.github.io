import { useNavigate } from "react-router-dom";
import { Button, Badge, Text } from "@cyangnouvong/dao-ui";

import { BackButton, ProjectHeader } from "../BaseProject";
import { PATHS } from "../../../routes";

import "../styles.css";
import "./styles.css";

const portfolioStack = [
  "React",
  "TypeScript",
  "Vite",
  "Three.js",
  "GLSL",
  "Framer Motion",
  "React Router",
];

const ProjectSection = ({
  title,
  badges,
  description,
  children,
}: {
  title: string;
  badges: string[];
  description: string;
  children?: React.ReactNode;
}) => (
  <div className="pp-project">
    <div className="pp-project__info">
      <div>
        <Text size="sm" weight="medium" color="ink">
          {title}
        </Text>
        <div className="badge-group" style={{ marginTop: "var(--space-2)" }}>
          {badges.map((b, i) => (
            <Badge key={b} variant={i % 2 === 0 ? "solid" : "subtle"} size="sm">
              {b}
            </Badge>
          ))}
        </div>
      </div>
      <Text size="sm" color="ink-mid" style={{ lineHeight: 1.75 }}>
        {description}
      </Text>
    </div>

    {children && <div className="pp-project__showcase">{children}</div>}
  </div>
);

const PersonalProjects = () => {
  const navigate = useNavigate();

  return (
    <div className="project-page-container">
      {/* Desktop */}
      <div className="project-layout project-layout--no-sidebar">
        <div className="right-col">
          <BackButton />
          <ProjectHeader
            title="Personal Projects"
            badgeTitles={["Frontend", "UI Design"]}
          />
          <hr className="section-rule" />

          <ProjectSection
            title="Design System"
            badges={["UI Design", "React", "npm"]}
            description="A personal component library built with React and TypeScript, published as an npm package. Components are built on a token-based theming system with full light and dark mode support."
          >
            <Button
              size="sm"
              variant="outline"
              showArrow
              onClick={() => navigate(PATHS.designSystem)}
            >
              View Components
            </Button>
          </ProjectSection>

          <hr className="section-rule" />

          <ProjectSection
            title="Pixel Animator"
            badges={["TypeScript", "Canvas API", "gif.js"]}
            description="A browser-based pixel art editor with multi-frame animation, onion skinning, palette management, and GIF export. Built with vanilla TypeScript and the Canvas API."
          >
            <Button
              size="sm"
              variant="outline"
              showArrow
              onClick={() => navigate(PATHS.daoPixel)}
            >
              Open Pixel Animator
            </Button>
          </ProjectSection>

          <hr className="section-rule" />

          <ProjectSection
            title="Personal Portfolio"
            badges={["Frontend"]}
            description="The site you're on. Features a Three.js topography scene with custom GLSL shaders, Framer Motion page transitions, hash-based routing, and a self-built design system."
          >
            <div className="pp-stack">
              {portfolioStack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </ProjectSection>
        </div>
      </div>

      {/* Mobile */}
      <div className="project-layout-mobile">
        <ProjectHeader
          title="Personal Projects"
          badgeTitles={["Frontend", "UI Design"]}
        />
        <hr className="section-rule" />

        <ProjectSection
          title="Design System"
          badges={["UI Design", "React", "npm"]}
          description="A personal component library built with React and TypeScript, published as an npm package. Components are built on a token-based theming system with full light and dark mode support."
        >
          <Button
            size="sm"
            variant="outline"
            showArrow
            onClick={() => navigate(PATHS.designSystem)}
          >
            View Components
          </Button>
        </ProjectSection>

        <hr className="section-rule" />

        <ProjectSection
          title="Pixel Animator"
          badges={["TypeScript", "Canvas API", "gif.js"]}
          description="A browser-based pixel art editor with multi-frame animation, onion skinning, palette management, and GIF export. Built with vanilla TypeScript and the Canvas API."
        >
          <Button
            size="sm"
            variant="outline"
            showArrow
            onClick={() => navigate(PATHS.daoPixel)}
          >
            Open Pixel Animator
          </Button>
        </ProjectSection>

        <hr className="section-rule" />

        <ProjectSection
          title="Personal Portfolio"
          badges={["Frontend"]}
          description="The site you're on. Features a Three.js topography scene with custom GLSL shaders, Framer Motion page transitions, hash-based routing, and a self-built design system."
        >
          <div className="pp-stack">
            {portfolioStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </ProjectSection>
      </div>
    </div>
  );
};

export default PersonalProjects;
