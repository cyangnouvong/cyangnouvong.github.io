import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { damp3, dampC } from "maath/easing";
import * as THREE from "three";
import { createPlaneCanvas } from "./planeCanvas";

const DAMP = 0.12;
const X_NUDGE = 0.15;
const Y_DROP = 0.12;
const HOVER_LIFT = 0.15;

const STENCIL_REFS = [1, 2, 3];

const CARDS = [
  { color: "#C2B6D3" },
  { color: "#a4af94" },
  { color: "#c585a6" },
];

const StencilClear = () => {
  const { gl } = useThree();
  useFrame(() => {
    const glCtx = gl.getContext() as WebGL2RenderingContext;
    glCtx.clear(glCtx.STENCIL_BUFFER_BIT);
  }, -1);
  return null;
};

const Card = ({
  index,
  active = 1,
  setActive,
  color,
  totalCards,
  planeImg,
  stencilRef,
}: any) => {
  const colorMeshRef = useRef<THREE.Mesh>(null);
  const overlayFrontRef = useRef<THREE.Mesh>(null);
  const overlayBackRef = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const { viewport } = useThree();

  const GAP_UNIT = viewport.width / totalCards;
  const W = GAP_UNIT * 0.8;
  const H = W * 2.2;
  const ACT_W = GAP_UNIT * 0.85;
  const ACT_H = ACT_W * 2.4;

  const mid = Math.floor(totalCards / 2);
  const isActive = active === index;

  const overlayW = ACT_W * (0.47 * 2 + 0.15);
  const overlayH = ACT_H * 1.25;
  const overlayAspect = overlayW / overlayH;

  const fullColor = useMemo(() => new THREE.Color(color), [color]);

  const hoverColor = useMemo(() => {
    const c = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    return new THREE.Color().setHSL(hsl.h, hsl.s * 0.4, hsl.l * 0.6);
  }, [color]);

  const idleColor = useMemo(() => {
    const c = new THREE.Color(color);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    return new THREE.Color().setHSL(hsl.h, hsl.s * 0.15, hsl.l * 0.35);
  }, [color]);

  const { planeCanvas, textureFront, textureBack } = useMemo(() => {
    const pc = createPlaneCanvas(overlayAspect);
    const tf = new THREE.CanvasTexture(pc.canvasFront);
    const tb = new THREE.CanvasTexture(pc.canvasBack);

    tf.colorSpace = THREE.SRGBColorSpace;
    tb.colorSpace = THREE.SRGBColorSpace;
    tf.minFilter = tb.minFilter = THREE.LinearFilter;

    return { planeCanvas: pc, textureFront: tf, textureBack: tb };
  }, [overlayAspect]);

  const cardMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: idleColor,
        toneMapped: false,
        stencilWrite: true,
        stencilFunc: THREE.AlwaysStencilFunc,
        stencilZPass: THREE.ReplaceStencilOp,
        stencilRef: stencilRef,
      }),
    [idleColor, stencilRef],
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textureBack,
        toneMapped: false,
        transparent: true,
        depthWrite: false,
        stencilFunc: THREE.NotEqualStencilFunc,
        stencilRef: stencilRef,
      }),
    [textureBack, stencilRef],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textureFront,
        toneMapped: false,
        transparent: false,
        alphaTest: 0.5,
        depthWrite: false,
      }),
    [textureFront],
  );

  const planeImgRef = useRef(planeImg);
  planeImgRef.current = planeImg;

  const wasAnimating = useRef(false);

  useFrame((_, delta) => {
    if (!colorMeshRef.current) return;

    const gapUnit = viewport.width / totalCards;
    const baseX = (index - mid) * gapUnit;

    const targetX =
      active === null || isActive
        ? baseX
        : baseX + (index < active ? -X_NUDGE : X_NUDGE);

    const targetY = isActive
      ? 0
      : hovered.current
        ? -Y_DROP + HOVER_LIFT
        : -Y_DROP;

    const targetScale: [number, number, number] = isActive
      ? [ACT_W, ACT_H, 1]
      : [W, H, 1];

    damp3(colorMeshRef.current.position, [targetX, targetY, 0], DAMP, delta);
    damp3(colorMeshRef.current.scale, targetScale, DAMP, delta);

    dampC(
      cardMaterial.color,
      isActive ? fullColor : hovered.current ? hoverColor : idleColor,
      0.1,
      delta,
    );

    const pos = colorMeshRef.current.position;

    overlayBackRef.current?.position.set(pos.x, pos.y, -0.001);
    overlayFrontRef.current?.position.set(pos.x, pos.y, 0.001);

    overlayBackRef.current?.scale.set(overlayW, overlayH, 1);
    overlayFrontRef.current?.scale.set(overlayW, overlayH, 1);

    const animating = isActive || hovered.current;

    if (animating && !wasAnimating.current) planeCanvas.reset();
    wasAnimating.current = animating;

    planeCanvas.update(animating);
    planeCanvas.draw(animating, planeImgRef.current);

    textureFront.needsUpdate = true;
    textureBack.needsUpdate = true;
  });

  const events = {
    onClick: (e: any) => {
      e.stopPropagation();
      setActive(active === index ? null : index);
    },
    onPointerOver: () => {
      hovered.current = true;
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      hovered.current = false;
      document.body.style.cursor = "auto";
    },
  };

  return (
    <>
      <mesh ref={overlayBackRef} material={backMaterial} {...events}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      <mesh ref={colorMeshRef} material={cardMaterial} {...events}>
        <planeGeometry args={[1, 1]} />
        <Text
          position={[-0.45, -0.45, 0.01]} // bottom-left corner
          fontSize={0.18}
          font={"/fonts/CormorantGaramond-Regular.ttf"}
          color={"#e4e4df"}
          anchorX="left"
          anchorY="bottom"
        >
          {index + 1}
        </Text>
      </mesh>

      <mesh ref={overlayFrontRef} material={frontMaterial} {...events}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
};

const Scene = ({ active, setActive, planeImg }: any) => {
  return (
    <group>
      <StencilClear />
      {CARDS.map((card, i) => (
        <Card
          key={i}
          index={i}
          active={active}
          setActive={setActive}
          color={card.color}
          totalCards={CARDS.length}
          planeImg={planeImg}
          stencilRef={STENCIL_REFS[i]}
        />
      ))}
    </group>
  );
};

export default Scene;
