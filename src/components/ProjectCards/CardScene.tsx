import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp3, dampC } from "maath/easing";
import * as THREE from "three";
import { createPlaneSim } from "./planeSim";
import { createPlaneOverlay, createPlaneTextures } from "./planeOverlay";

const DAMP = 0.12;

const CARDS = [
  { color: "#8d80a0" },
  { color: "#858e77" },
  { color: "#c585a6" },
];

interface CardProps {
  index: number;
  active: number | null;
  setActive: (active: number | null) => void;
  color: string;
  totalCards: number;
  planeTextures: [THREE.Texture, THREE.Texture] | null;
}

const Card = ({
  index,
  active,
  setActive,
  color,
  totalCards,
  planeTextures,
}: CardProps) => {
  const cardRef = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);
  const { viewport, size, gl } = useThree();

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

  const planeSim = useMemo(() => createPlaneSim(cardAspect), [cardAspect]);
  const overlay = useMemo(() => createPlaneOverlay(), []);
  useEffect(() => () => overlay.dispose(), [overlay]);

  const baseOrder = index * 3;

  const cardMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: idleColor,
        toneMapped: false,
      }),
    [idleColor],
  );

  const wasAnimating = useRef(false);

  useFrame((_, delta) => {
    if (!cardRef.current) return;

    const vw = viewport.width;
    const vh = viewport.height;
    const portrait = vh > vw;

    let targetX: number;
    const targetY = 0;
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

    const animating = isActive || hovered.current;
    if (animating && !wasAnimating.current) planeSim.reset();
    wasAnimating.current = animating;

    planeSim.update(animating);

    // Backbuffer pixels per world unit, so dot sizes track the on-screen card
    const pxPerUnit = (size.width / viewport.width) * gl.getPixelRatio();
    overlay.update(
      planeSim,
      animating,
      pos.x,
      pos.y,
      curScale.x,
      curScale.y,
      pxPerUnit,
      planeTextures,
    );
  });

  const events = {
    onClick: (e: { stopPropagation: () => void }) => {
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
      <primitive
        object={overlay.trail}
        renderOrder={baseOrder + 2}
        dispose={null}
      />
      <primitive
        object={overlay.sprite}
        renderOrder={baseOrder + 3}
        dispose={null}
      />
    </>
  );
};

interface SceneProps {
  active: number | null;
  setActive: (active: number | null) => void;
  planeImgs: [HTMLImageElement, HTMLImageElement] | null;
}

const Scene = ({ active, setActive, planeImgs }: SceneProps) => {
  // Two small sprite textures per theme, shared by all cards
  const planeTextures = useMemo(
    () => (planeImgs ? createPlaneTextures(planeImgs) : null),
    [planeImgs],
  );
  useEffect(
    () => () => {
      planeTextures?.forEach((t) => t.dispose());
    },
    [planeTextures],
  );

  return (
    <group>
      {CARDS.map((card, i) => (
        <Card
          key={i}
          index={i}
          active={active}
          setActive={setActive}
          color={card.color}
          totalCards={CARDS.length}
          planeTextures={planeTextures}
        />
      ))}
    </group>
  );
};

export default Scene;
