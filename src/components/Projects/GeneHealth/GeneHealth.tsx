import { useNavigate } from "react-router-dom";
import { Text, Badge, Button } from "@cyangnouvong/dao-ui";

const GeneHealth = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "clamp(12px, 3vh, 48px) clamp(16px, 2vw, 48px)",
        height: "100%",
      }}
    >
      <section style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Text font="display" size="xl" style={{ marginRight: "16px" }}>
          GeneHealth AI
        </Text>
        <Badge variant="solid">Full Stack</Badge>
        <Badge variant="subtle">UI Design</Badge>
      </section>
      <div
        style={{ width: "100px", height: "23px" }}
        onClick={() => navigate("/", { state: { scrollTo: "selected-works" } })}
      >
        <Button>Back</Button>
      </div>
    </div>
  );
};

export default GeneHealth;
