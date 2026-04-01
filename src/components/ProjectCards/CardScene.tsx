import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp3, dampC } from "maath/easing";
import * as THREE from "three";
import { createPlaneCanvas } from "./planeCanvas";

const DAMP = 0.12;

const STENCIL_REFS = [1, 2, 3];

const CARDS = [
  { color: "#8d80a0" },
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
  active,
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

  const activeIndex = active ?? 0;
  const isActive = active === index;
  const mid = Math.floor(totalCards / 2);

  const cardAspect = useMemo(() => {
    const portrait = viewport.height > viewport.width;
    return portrait
      ? viewport.width / viewport.height
      : viewport.width / totalCards / viewport.height;
  }, [viewport.width, viewport.height, totalCards]);

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
    const pc = createPlaneCanvas(cardAspect);
    const tf = new THREE.CanvasTexture(pc.canvasFront);
    const tb = new THREE.CanvasTexture(pc.canvasBack);
    tf.colorSpace = tb.colorSpace = THREE.SRGBColorSpace;
    tf.minFilter = tb.minFilter = THREE.LinearFilter;
    return { planeCanvas: pc, textureFront: tf, textureBack: tb };
  }, [cardAspect]);

  const baseOrder = index * 3;

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
        transparent: true,
        depthWrite: false,
        stencilFunc: THREE.EqualStencilFunc,
        stencilRef: stencilRef,
        stencilWrite: false,
      }),
    [textureFront, stencilRef],
  );

  const planeImgRef = useRef(planeImg);
  planeImgRef.current = planeImg;
  const wasAnimating = useRef(false);

  useFrame((_, delta) => {
    if (!colorMeshRef.current) return;

    const vw = viewport.width;
    const vh = viewport.height;
    const portrait = vh > vw;

    let targetX: number;
    let targetY = 0;
    let targetW: number;
    let targetH: number;

    if (portrait) {
      targetW = vw;
      targetH = vh;

      if (isActive) {
        targetX = 0;
      } else {
        targetX = (index < activeIndex ? -1 : 1) * vw;
      }
    } else {
      // Desktop: equal columns
      const colW = vw / totalCards;
      targetW = colW;
      targetH = vh;
      targetX = (index - mid) * colW;
    }

    damp3(colorMeshRef.current.position, [targetX, targetY, 0], DAMP, delta);
    damp3(colorMeshRef.current.scale, [targetW, targetH, 1], DAMP, delta);

    dampC(
      cardMaterial.color,
      isActive ? fullColor : hovered.current ? hoverColor : idleColor,
      0.1,
      delta,
    );

    const pos = colorMeshRef.current.position;
    const curScale = colorMeshRef.current.scale;

    overlayBackRef.current?.position.set(pos.x, pos.y, 0);
    overlayFrontRef.current?.position.set(pos.x, pos.y, 0);
    overlayBackRef.current?.scale.set(curScale.x, curScale.y, 1);
    overlayFrontRef.current?.scale.set(curScale.x, curScale.y, 1);

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
      const portrait = viewport.height > viewport.width;
      if (portrait) {
        setActive(index);
      } else {
        setActive(active === index ? null : index);
      }
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
      <mesh
        ref={overlayBackRef}
        material={backMaterial}
        renderOrder={baseOrder}
        {...events}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh
        ref={colorMeshRef}
        material={cardMaterial}
        renderOrder={baseOrder + 1}
        {...events}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh
        ref={overlayFrontRef}
        material={frontMaterial}
        renderOrder={baseOrder + 2}
        {...events}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
};

const Scene = ({ active, setActive, planeImg }: any) => (
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

export default Scene;
