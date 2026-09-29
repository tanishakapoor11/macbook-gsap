"use client";

import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import StudioLights from "./three/StudioLights";
import { features, featureSequence } from "@/constants";
import clsx from "clsx";
import { Html } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { getVideoTexture, MacbookModel } from "./models/Macbook";
import { useMacbookStore } from "@/store";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Group } from "three";

const STEPS = featureSequence.length;

const ModelScroll = () => {
  const groupRef = useRef<Group>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const setTexture = useMacbookStore((s) => s.setTexture);

  // Pre-load all feature videos during component mount. Same cache the model
  // reads from, so switching screens later is instant.
  useEffect(() => {
    featureSequence.forEach(({ videoPath }) => getVideoTexture(videoPath));
  }, []);

  useGSAP(
    () => {
      const group = groupRef.current;
      if (!group) return;

      // One trigger drives everything, so model, copy and screen can't drift.
      // The stage (canvas + copy) is pinned together; each feature gets 100vh.
      let active = -1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: "#features .stage",
          start: "top top",
          end: `+=${STEPS * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Derived from progress (not timeline.call) so scrolling back up
          // restores the right video too.
          onUpdate: ({ progress }) => {
            const index = Math.min(STEPS - 1, Math.floor(progress * STEPS));
            if (index !== active) {
              active = index;
              setTexture(featureSequence[index].videoPath);
            }
          },
        },
      });

      // Timeline time i..i+1 == feature i (matches onUpdate's progress index).
      // Each feature opens with one full turn that lands screen-forward, then
      // holds still so its video is readable. The video swaps at the start of
      // the turn, while the screen faces away, and is revealed as it lands.
      const SPIN = 0.5;
      tl.set(group.rotation, { y: 0 }, 0);
      tl.set({}, {}, STEPS); // pad to STEPS so time i maps to progress i / STEPS

      features.forEach((_, i) => {
        if (i > 0) {
          // Absolute from/to (not relative .to) so each turn always ends on a
          // whole rotation, whatever state a refresh or fast scroll left it in.
          tl.fromTo(
            group.rotation,
            { y: Math.PI * 2 * (i - 1) },
            {
              y: Math.PI * 2 * i,
              duration: SPIN,
              ease: "power2.inOut",
              immediateRender: false,
            },
            i,
          );
        }

        // Copy fades up as the model settles and leaves (fades out, drifting
        // up) as the next turn starts, so only the current feature is shown.
        tl.fromTo(
          `.box${i + 1}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3 },
          i === 0 ? 0.1 : i + SPIN * 0.7,
        );
        if (i < STEPS - 1) {
          tl.to(
            `.box${i + 1}`,
            { opacity: 0, y: -20, duration: 0.3 },
            i + 1,
          );
        }
      });
    },
    { dependencies: [isMobile], revertOnUpdate: true },
  );

  return (
    <group ref={groupRef}>
      <Suspense
        fallback={
          <Html center>
            <h1 className="text-white text-3xl uppercase">Loading...</h1>
          </Html>
        }
      >
        <MacbookModel scale={isMobile ? 0.05 : 0.08} position={[0, -1, 0]} />
      </Suspense>
    </group>
  );
};

const Features = () => {
  return (
    <section id="features">
      <h2> See it all in a new light.</h2>
      <div className="stage">
        <Canvas id="f-canvas" camera={{}}>
          <StudioLights />
          <ambientLight intensity={0.5} />
          <ModelScroll />
        </Canvas>
        <div className="boxes">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={clsx("box", `box${index + 1}`, feature.styles)}
            >
              <img src={feature.icon} alt={feature.highlight} />
              <p>
                <span className="text-white">{feature.highlight} </span>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
