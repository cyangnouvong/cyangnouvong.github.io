import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  DotIndicator,
  Drawer,
  Input,
  Text,
  ToastProvider,
  useToast,
  Tooltip,
  RadioGroup,
  typography,
  colors,
  spacing,
  type TypographySizeKey,
} from "@cyangnouvong/dao-ui";

import { ProjectHeader } from "../BaseProject";
import { PATHS } from "../../../routes";

import "../styles.css";
import "./styles.css";

const Btn = ({
  children,
  variant = "primary",
  size = "sm",
  showArrow,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "emphasis";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const heights: Record<string, string> = {
    sm: "32px",
    md: "40px",
    lg: "48px",
  };
  const isEmphasis = variant === "emphasis";
  return (
    <div
      style={{
        height: isEmphasis ? `calc(${heights[size]} + 10px)` : heights[size],
        width: isEmphasis ? "150px" : "130px",
        flexShrink: 0,
      }}
    >
      <Button
        variant={variant}
        size={size}
        showArrow={showArrow}
        onClick={onClick}
        disabled={disabled}
        loading={loading}
      >
        {children}
      </Button>
    </div>
  );
};

const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <div className="ds-row">
      <Btn
        variant="outline"
        onClick={() => toast("Default notification", "default")}
      >
        Default
      </Btn>
      <Btn
        variant="outline"
        onClick={() => toast("Action completed successfully", "success")}
      >
        Success
      </Btn>
      <Btn
        variant="outline"
        onClick={() => toast("Something went wrong", "error")}
      >
        Error
      </Btn>
    </div>
  );
};

const DrawerDemo = () => {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right">("right");

  const openDrawer = (s: "left" | "right") => {
    setSide(s);
    setOpen(true);
  };

  return (
    <>
      <div className="ds-row">
        <Btn variant="outline" onClick={() => openDrawer("left")}>
          Open Left
        </Btn>
        <Btn variant="outline" onClick={() => openDrawer("right")}>
          Open Right
        </Btn>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} side={side}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing[4],
          }}
        >
          <Text size="sm" weight="medium" color="ink">
            {side === "left" ? "Left" : "Right"} Drawer
          </Text>
          <Text size="sm" color="ink-mid" style={{ lineHeight: 1.7 }}>
            Slide-in panel from the {side} side. Use for contextual content,
            settings, or navigation.
          </Text>
        </div>
      </Drawer>
    </>
  );
};

const DotDemo = () => {
  const [active, setActive] = useState(0);
  const count = 5;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[4],
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: spacing[4] }}>
        <DotIndicator
          count={count}
          active={active}
          onChange={setActive}
          direction="horizontal"
          size="md"
        />
        <Text size="xs" color="ink-faint">
          {active + 1} of {count}
        </Text>
      </div>
      <div className="ds-row">
        <Btn
          size="sm"
          variant="outline"
          onClick={() => setActive((i) => Math.max(0, i - 1))}
        >
          Prev
        </Btn>
        <Btn
          size="sm"
          variant="outline"
          onClick={() => setActive((i) => Math.min(count - 1, i + 1))}
        >
          Next
        </Btn>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing[3],
        }}
      >
        <Text size="xs" color="ink-mid">
          Horizontal
        </Text>
        {(["sm", "md", "lg"] as const).map((s) => (
          <div
            key={s}
            style={{ display: "flex", alignItems: "center", gap: spacing[3] }}
          >
            <Text size="xs" color="ink-faint" style={{ width: "2rem" }}>
              {s}
            </Text>
            <DotIndicator
              count={5}
              active={active}
              direction="horizontal"
              size={s}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing[3],
        }}
      >
        <Text size="xs" color="ink-mid">
          Vertical
        </Text>
        <div
          style={{ display: "flex", gap: spacing[6], alignItems: "flex-start" }}
        >
          {(["sm", "md", "lg"] as const).map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: spacing[2],
              }}
            >
              <DotIndicator
                count={5}
                active={active}
                direction="vertical"
                size={s}
              />
              <Text size="xs" color="ink-faint">
                {s}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="ds-section">
    <Text
      size="xs"
      color="ink-faint"
      tracking="wider"
      style={{ textTransform: "uppercase" }}
    >
      {title}
    </Text>
    <div className="ds-section__content">{children}</div>
  </div>
);

const ColorSwatch = ({ name, hex }: { name: string; hex: string }) => (
  <div className="ds-swatch">
    <div className="ds-swatch__color" style={{ background: hex }} />
    <Text size="xs" color="ink-mid">
      {name}
    </Text>
    <Text size="xs" color="ink-faint">
      {hex}
    </Text>
  </div>
);

const SpacingRow = ({ name, value }: { name: string; value: string }) => (
  <div className="ds-spacing-row">
    <Text size="xs" color="ink-faint" style={{ width: "2rem", flexShrink: 0 }}>
      {name}
    </Text>
    <div className="ds-spacing-bar" style={{ width: value }} />
    <Text size="xs" color="ink-mid">
      {value}
    </Text>
  </div>
);

const DesignSystemShowcase = () => {
  const navigate = useNavigate();
  const [radioH, setRadioH] = useState("a");
  const [radioV, setRadioV] = useState("1");

  return (
    <ToastProvider>
      <div className="project-page-container">
        <div className="right-col" style={{ paddingBottom: spacing[10] }}>
          <div
            className="back-button"
            onClick={() => navigate(PATHS.personalProjects)}
          >
            <Button size="sm" variant="outline">
              Back
            </Button>
          </div>

          <ProjectHeader
            title="Design System"
            badgeTitles={["React", "TypeScript"]}
          />

          <hr className="section-rule" />

          <Text size="sm" color="ink-muted" style={{ fontStyle: "italic" }}>
            Tip: use the theme toggle to preview all components in light and
            dark mode.
          </Text>

          <div className="ds-page-grid">
            <Section title="Colors — Light">
              <div className="ds-swatches">
                {Object.entries(colors.light).map(([name, hex]) => (
                  <ColorSwatch key={name} name={name} hex={hex} />
                ))}
              </div>
            </Section>

            <Section title="Colors — Dark">
              <div className="ds-swatches">
                {Object.entries(colors.dark).map(([name, hex]) => (
                  <ColorSwatch key={name} name={name} hex={hex} />
                ))}
              </div>
            </Section>

            <Section title="Typography — Size">
              <div className="ds-type-stack">
                {Object.entries(typography.size).map(([key, value]) => (
                  <div key={key} className="ds-type-row">
                    <Text
                      size="xs"
                      color="ink-faint"
                      style={{ width: "3rem", flexShrink: 0 }}
                    >
                      {key}
                    </Text>
                    <Text
                      size={key as TypographySizeKey}
                      style={{ lineHeight: 1.2 }}
                    >
                      Aa
                    </Text>
                    <Text size="xs" color="ink-faint">
                      {value}
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Typography — Weight & Tracking">
              <div className="ds-type-stack">
                {Object.entries(typography.weight).map(([key, value]) => (
                  <div key={key} className="ds-type-row">
                    <Text
                      size="xs"
                      color="ink-faint"
                      style={{ width: "5rem", flexShrink: 0 }}
                    >
                      {key}
                    </Text>
                    <Text size="sm" style={{ fontWeight: value }}>
                      The quick brown fox
                    </Text>
                  </div>
                ))}
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--ink-faint)",
                }}
              />
              <div className="ds-type-stack">
                {Object.entries(typography.tracking).map(([key, value]) => (
                  <div key={key} className="ds-type-row">
                    <Text
                      size="xs"
                      color="ink-faint"
                      style={{ width: "5rem", flexShrink: 0 }}
                    >
                      {key}
                    </Text>
                    <Text size="sm" style={{ letterSpacing: value }}>
                      Tracking
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Fonts">
              <div className="ds-type-stack">
                {Object.entries(typography.font).map(([key, value]) => (
                  <div key={key} className="ds-type-row">
                    <Text
                      size="xs"
                      color="ink-faint"
                      style={{ width: "4rem", flexShrink: 0 }}
                    >
                      {key}
                    </Text>
                    <Text size="sm" style={{ fontFamily: value }}>
                      The quick brown fox
                    </Text>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Spacing">
              <div className="ds-spacing-stack">
                {Object.entries(spacing).map(([key, value]) => (
                  <SpacingRow key={key} name={key} value={value} />
                ))}
              </div>
            </Section>

            <Section title="Button — Variants">
              <div className="ds-row">
                <Btn variant="primary">Primary</Btn>
                <Btn variant="outline">Outline</Btn>
                <Btn variant="emphasis" showArrow>
                  Emphasis
                </Btn>
              </div>
            </Section>

            <Section title="Button — Sizes">
              <div className="ds-row">
                <Btn size="sm">Small</Btn>
                <Btn size="md">Medium</Btn>
                <Btn size="lg">Large</Btn>
              </div>
              <div className="ds-row">
                <Btn size="sm" disabled>
                  Disabled
                </Btn>
                <Btn size="sm" loading>
                  Loading
                </Btn>
                <Btn size="sm" showArrow>
                  With arrow
                </Btn>
              </div>
            </Section>

            <Section title="Badge">
              <div className="ds-row">
                <Badge variant="solid">Solid</Badge>
                <Badge variant="subtle">Subtle</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="ds-row">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </Section>

            <Section title="Input">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing[2],
                }}
              >
                <Text size="xs" color="ink-mid">
                  Underline variant
                </Text>
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  variant="underline"
                  size="sm"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing[2],
                }}
              >
                <Text
                  size="xs"
                  color="ink-mid"
                  style={{ marginBottom: spacing[2] }}
                >
                  Outline variant
                </Text>
                <Input
                  label="Name"
                  placeholder="Your name"
                  variant="outline"
                  size="sm"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing[2],
                }}
              >
                <Text size="xs" color="ink-mid">
                  Error state
                </Text>
                <Input
                  label="Password"
                  placeholder="••••••••"
                  error="Password is required"
                  size="sm"
                />
              </div>
            </Section>

            <Section title="RadioGroup">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing[2],
                }}
              >
                <Text size="xs" color="ink-mid">
                  Horizontal
                </Text>
                <RadioGroup
                  options={[
                    { label: "Option A", value: "a" },
                    { label: "Option B", value: "b" },
                    { label: "Option C", value: "c" },
                  ]}
                  value={radioH}
                  onChange={setRadioH}
                  direction="horizontal"
                  size="sm"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: spacing[2],
                }}
              >
                <Text size="xs" color="ink-mid">
                  Vertical
                </Text>
                <RadioGroup
                  options={[
                    { label: "One", value: "1" },
                    { label: "Two", value: "2" },
                    { label: "Three", value: "3" },
                  ]}
                  value={radioV}
                  onChange={setRadioV}
                  direction="vertical"
                  size="sm"
                />
              </div>
            </Section>

            <Section title="Dot Indicator">
              <DotDemo />
            </Section>

            <Section title="Tooltip">
              <div className="ds-row">
                <Tooltip label="Top" placement="top">
                  <Badge variant="outline">Top</Badge>
                </Tooltip>
                <Tooltip label="Right" placement="right">
                  <Badge variant="outline">Right</Badge>
                </Tooltip>
                <Tooltip label="Bottom" placement="bottom">
                  <Badge variant="outline">Bottom</Badge>
                </Tooltip>
                <Tooltip label="Left" placement="left">
                  <Badge variant="outline">Left</Badge>
                </Tooltip>
              </div>
            </Section>

            <Section title="Drawer">
              <DrawerDemo />
            </Section>

            <Section title="Toast">
              <ToastDemo />
            </Section>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default DesignSystemShowcase;
