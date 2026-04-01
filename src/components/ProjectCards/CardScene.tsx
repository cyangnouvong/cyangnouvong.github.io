import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp3, dampC } from "maath/easing";
import * as THREE from "three";
import { createPlaneCanvas } from "./planeCanvas";

const DAMP = 0.12;

const CARDS = [
  { color: "#8d80a0" },
  { color: "#a4af94" },
  { color: "#c585a6" },
];

interface CardProps {
  index: number;
  active: number | null;
  setActive: (active: number | null) => void;
  color: string;
  totalCards: number;
  planeImgs: [HTMLImageElement, HTMLImageElement] | null;
}

const Card = ({
  index,
  active,
  setActive,
  color,
  totalCards,
  planeImgs,
}: CardProps) => {
  const cardRef = useRef<THREE.Mesh>(null);
  const planeOverlayRef = useRef<THREE.Mesh>(null);
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

  const { planeCanvas, textureFront } = useMemo(() => {
    const pc = createPlaneCanvas(cardAspect);
    const tf = new THREE.CanvasTexture(pc.canvasFront);
    tf.colorSpace = THREE.SRGBColorSpace;
    return { planeCanvas: pc, textureFront: tf };
  }, [cardAspect]);

  const baseOrder = index * 3;

  const cardMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: idleColor,
        toneMapped: false,
      }),
    [idleColor],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textureFront,
        toneMapped: false,
        transparent: true,
      }),
    [textureFront],
  );

  const planeImgRef = useRef(planeImgs);
  planeImgRef.current = planeImgs;
  const wasAnimating = useRef(false);

  useFrame((_, delta) => {
    if (!cardRef.current) return;

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

    damp3(cardRef.current.position, [targetX, targetY, 0], DAMP, delta);
    damp3(cardRef.current.scale, [targetW, targetH, 1], DAMP, delta);

    dampC(
      cardMaterial.color,
      isActive ? fullColor : hovered.current ? hoverColor : idleColor,
      0.1,
      delta,
    );

    const pos = cardRef.current.position;
    const curScale = cardRef.current.scale;

    planeOverlayRef.current?.position.set(pos.x, pos.y, 0);
    planeOverlayRef.current?.scale.set(curScale.x, curScale.y, 1);

    const animating = isActive || hovered.current;
    if (animating && !wasAnimating.current) planeCanvas.reset();
    wasAnimating.current = animating;

    planeCanvas.update(animating);
    const imgs = planeImgRef.current;
    planeCanvas.draw(animating, imgs?.[0] ?? null, imgs?.[1] ?? null);

    textureFront.needsUpdate = true;
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
        ref={cardRef}
        material={cardMaterial}
        renderOrder={baseOrder + 1}
        {...events}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh
        ref={planeOverlayRef}
        material={frontMaterial}
        renderOrder={baseOrder + 2}
        {...events}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
};

interface SceneProps {
  active: number | null;
  setActive: (active: number | null) => void;
  planeImgs: [HTMLImageElement, HTMLImageElement] | null;
}

const Scene = ({ active, setActive, planeImgs }: SceneProps) => (
  <group>
    {CARDS.map((card, i) => (
      <Card
        key={i}
        index={i}
        active={active}
        setActive={setActive}
        color={card.color}
        totalCards={CARDS.length}
        planeImgs={planeImgs}
      />
    ))}
  </group>
);

export default Scene;
