import { Text, Badge, Button } from "@cyangnouvong/dao-ui";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { PATHS } from "../../routes";

interface BaseProjectProps {
  title: string;
  badgeTitles: string[];
  introDescription: string;
  techStack: string[];
  keyContributions: { label: string; detail: string }[];
  metadata?: MetaItem[];
  photos?: string[];
}

interface MetaItem {
  label: string;
  value: string;
}

interface KeyContributions {
  label: string;
  detail: string;
}

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div
      className="back-button"
      onClick={() =>
        navigate(PATHS.home, { state: { scrollTo: "selected-works" } })
      }
    >
      <Button size="sm" variant="outline">
        Back
      </Button>
    </div>
  );
};

export const ProjectHeader = ({
  title,
  badgeTitles,
}: {
  title: string;
  badgeTitles: string[];
}) => {
  return (
    <section>
      <Text
        font="display"
        size="xl"
        weight="light"
        style={{ fontStyle: "italic" }}
      >
        {title}
      </Text>
      <div className="badge-group" style={{ marginTop: "var(--space-3)" }}>
        {badgeTitles.map((badge, i) => (
          <Badge key={badge} variant={i % 2 === 0 ? "solid" : "subtle"}>
            {badge}
          </Badge>
        ))}
      </div>
    </section>
  );
};

export const ContributionsList = ({
  title,
  keyContributions,
}: {
  title: string;
  keyContributions: KeyContributions[];
}) => {
  return (
    <div className="contributions">
      <Text
        size="xs"
        color="ink-faint"
        tracking="wider"
        style={{
          textTransform: "uppercase",
          marginBottom: "var(--space-1)",
        }}
      >
        {title}
      </Text>
      {keyContributions.map(({ label, detail }) => (
        <div key={label} className="work-item">
          <Text
            size="sm"
            color="ink-faint"
            style={{ flexShrink: 0, marginTop: 2 }}
            className="work-item__dash"
          >
            —
          </Text>
          <div className="work-item__content">
            {label !== "" && (
              <Text size="sm" weight="medium" color="ink">
                {label}
              </Text>
            )}
            <Text size="sm" color="ink-mid" style={{ lineHeight: 1.7 }}>
              {detail}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
};

const TechStackDesktop = ({ techStack }: { techStack: string[] }) => (
  <div className="tech-col">
    <Text
      size="xs"
      color="ink-faint"
      tracking="wider"
      style={{ textTransform: "uppercase" }}
    >
      Stack
    </Text>
    {techStack.map((tech) => (
      <div key={tech}>
        <Badge
          variant="outline"
          style={{ justifyContent: "center", width: "100%", height: "32px" }}
        >
          {tech}
        </Badge>
      </div>
    ))}
  </div>
);

const TechStackMobile = ({ techStack }: { techStack: string[] }) => (
  <div className="tech-section-mobile">
    <Text
      size="xs"
      color="ink-faint"
      tracking="wider"
      style={{ textTransform: "uppercase", marginBottom: "var(--space-3)" }}
    >
      Stack
    </Text>
    <div className="tech-pills-mobile">
      {techStack.map((tech) => (
        <Badge key={tech} variant="outline" style={{ height: "30px" }}>
          {tech}
        </Badge>
      ))}
    </div>
  </div>
);

const hasLeftCol = (metadata?: MetaItem[], photos?: string[]) => {
  return (metadata && metadata.length > 0) || (photos && photos.length > 0);
};

const LeftCol = ({
  metadata,
  photos,
}: {
  metadata?: MetaItem[];
  photos?: string[];
}) => (
  <div className="left-col">
    <BackButton />

    {metadata && metadata.length > 0 && (
      <div className="meta-block">
        {metadata.map(({ label, value }) => (
          <div key={label} className="meta-item">
            <Text
              size="xs"
              color="ink-faint"
              tracking="wider"
              style={{ textTransform: "uppercase" }}
            >
              {label}
            </Text>
            <Text size="sm" color="ink-mid">
              {value}
            </Text>
          </div>
        ))}
      </div>
    )}

    {photos && photos.length > 0 && (
      <>
        {photos.map((photo) => (
          <div key={photo} className={"media-block"}>
            <img
              src={photo}
              alt={`Preview ${photo}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </>
    )}
  </div>
);

const BaseProject = ({
  title,
  badgeTitles,
  introDescription,
  techStack,
  keyContributions,
  metadata,
  photos,
}: BaseProjectProps) => {
  const showLeftCol = hasLeftCol(metadata, photos);

  return (
    <div className="project-page-container">
      <div
        className={`project-layout ${
          !showLeftCol ? "project-layout--no-sidebar" : ""
        }`}
      >
        {showLeftCol && <LeftCol metadata={metadata} photos={photos} />}

        <div className="right-col">
          {!showLeftCol && <BackButton />}

          <ProjectHeader title={title} badgeTitles={badgeTitles} />

          <hr className="section-rule" />

          <Text size="sm" color="ink-mid" style={{ lineHeight: 1.75 }}>
            {introDescription}
          </Text>

          <hr className="section-rule" />

          <div className="lower">
            <ContributionsList
              title="Key Contributions"
              keyContributions={keyContributions}
            />
            <TechStackDesktop techStack={techStack} />
          </div>
        </div>
      </div>

      <div className="project-layout-mobile">
        <ProjectHeader title={title} badgeTitles={badgeTitles} />

        <hr className="section-rule" />

        <Text size="sm" color="ink-mid" style={{ lineHeight: 1.75 }}>
          {introDescription}
        </Text>

        <hr className="section-rule" />

        <TechStackMobile techStack={techStack} />

        <hr className="section-rule" />

        <ContributionsList
          title={"Key Contributions"}
          keyContributions={keyContributions}
        />

        {metadata && metadata.length > 0 && (
          <>
            <hr className="section-rule" />
            <div className="meta-block-mobile">
              {metadata.map(({ label, value }) => (
                <div key={label} className="meta-item">
                  <Text
                    size="xs"
                    color="ink-faint"
                    tracking="wider"
                    style={{ textTransform: "uppercase" }}
                  >
                    {label}
                  </Text>
                  <Text size="sm" color="ink-mid">
                    {value}
                  </Text>
                </div>
              ))}
            </div>
          </>
        )}
        {photos && photos.length > 0 && (
          <>
            <hr className="section-rule" />
            <div className="previews-mobile">
              <Text
                size="xs"
                color="ink-faint"
                tracking="wider"
                style={{
                  textTransform: "uppercase",
                  marginBottom: "var(--space-3)",
                }}
              >
                Previews
              </Text>
              {photos.map((photo) => (
                <div key={photo} className={"media-block"}>
                  <img
                    src={photo}
                    alt={`Preview ${photo}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BaseProject;
