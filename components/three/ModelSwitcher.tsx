import { PresentationControls } from "@react-three/drei";
import React, { useRef } from "react";
import { MacbookModel16 } from "../models/Macbook-16";
import MacbookModel14 from "../models/Macbook-14";
import type { Group, Material, Mesh } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

// Slides + fades a model in or out. The hidden one is set invisible once the
// fade ends so it stops rendering and can't grab drags from the visible one.
const animateModel = (
  group: Group | null,
  show: boolean,
  x: number,
  duration: number,
) => {
  if (!group) return;
  const opacity = show ? 1 : 0;
  group.visible = true;

  // overwrite kills any in-flight tween, so a stale onComplete from a fast
  // double-click can't hide the model that is now fading back in.
  gsap.to(group.position, { x, duration, overwrite: true });

  group.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const materials = ([] as Material[]).concat(mesh.material);
    materials.forEach((material) => {
      material.transparent = true;
      gsap.to(material, {
        opacity,
        duration,
        overwrite: true,
        onComplete: () => {
          // Opaque again when fully shown, avoids transparency sorting glitches.
          material.transparent = !show;
          group.visible = show;
        },
      });
    });
  });
};

const ModelSwitcher = ({
  scale,
  isMobile,
}: {
  scale: number;
  isMobile: boolean;
}) => {
  const smallMacbookRef = useRef<Group>(null);
  const largeMacbookRef = useRef<Group>(null);
  const isFirstRun = useRef(true);

  const showLargeMacbook = scale === 0.08;

  useGSAP(() => {
    // Snap into place on mount instead of both models animating from x=0.
    const duration = isFirstRun.current ? 0 : ANIMATION_DURATION;
    isFirstRun.current = false;

    animateModel(
      largeMacbookRef.current,
      showLargeMacbook,
      showLargeMacbook ? 0 : OFFSET_DISTANCE,
      duration,
    );
    animateModel(
      smallMacbookRef.current,
      !showLargeMacbook,
      showLargeMacbook ? -OFFSET_DISTANCE : 0,
      duration,
    );
  }, [showLargeMacbook]);

  const controlsConfig = {
    snap: true,
    speed: 1,
    zoom: 1,
    polar: [-Math.PI, Math.PI] as [number, number],
    azimuth: [-Infinity, Infinity] as [number, number],
    config: { mass: 1, tension: 0, friction: 26 },
  };
  return (
    <>
      <PresentationControls {...controlsConfig}>
        <group ref={largeMacbookRef}>
          <MacbookModel16 scale={isMobile ? 0.05 : 0.08} />
        </group>
      </PresentationControls>

      <PresentationControls {...controlsConfig}>
        <group ref={smallMacbookRef}>
          <MacbookModel14 scale={isMobile ? 0.03 : 0.06} />
        </group>
      </PresentationControls>
    </>
  );
};

export default ModelSwitcher;
