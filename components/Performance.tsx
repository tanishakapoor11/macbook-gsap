"use client";

import { performanceImages, performanceImgPositions } from "@/constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Performance = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".content p",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: ".content p",
            start: "top bottom",
            end: "top center",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      if (isMobile) {
        // Offset from an image's centre to the wrapper's centre. Uses offset*
        // (layout box) instead of getBoundingClientRect so in-flight transforms
        // don't skew the value when ScrollTrigger re-measures on resize.
        const toCenter = (axis: "x" | "y") => (_: number, el: HTMLElement) => {
          const parent = el.offsetParent as HTMLElement;
          return axis === "x"
            ? (parent.offsetWidth - el.offsetWidth) / 2 - el.offsetLeft
            : (parent.offsetHeight - el.offsetHeight) / 2 - el.offsetTop;
        };

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".wrapper",
            start: "top 85%",
            end: "bottom 75%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        mobileTl
          .fromTo(
            ".p5",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, ease: "power2.out" },
            0,
          )
          // Collage "bursts" out from behind the centre image into place.
          .fromTo(
            ".wrapper img:not(.p5)",
            {
              x: toCenter("x"),
              y: toCenter("y"),
              scale: 0.4,
              rotation: (i: number) => (i % 2 ? 12 : -12),
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              opacity: 1,
              ease: "power3.out",
              stagger: 0.08,
            },
            0.15,
          );
        return;
      }

      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "power1.inOut", overwrite: "auto" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      performanceImgPositions.forEach((item) => {
        if (item.id === "p5") return;

        const vars: gsap.TweenVars = {};
        if ("left" in item) vars.left = `${item.left}%`;
        if ("right" in item) vars.right = `${item.right}%`;
        if ("bottom" in item) vars.bottom = `${item.bottom}%`;
        if ("transform" in item) vars.transform = item.transform as string;

        tl.to(`.${item.id}`, vars, 0);
      });
    },
    // revertOnUpdate kills the old breakpoint's timeline (and its inline
    // styles) before the other one is built; without it both would stay live.
    { scope: sectionRef, dependencies: [isMobile], revertOnUpdate: true },
  );

  return (
    <section id="performance" ref={sectionRef}>
      <h2>Next-level graphics performance. Game on.</h2>
      <div className="wrapper">
        {performanceImages.map((img) => (
          <img key={img.id} src={img.src} alt={img.id} className={img.id} />
        ))}
      </div>
      <div className="content">
        <p>
          Run graphics-intensive workflows with a responsiveness that keeps up
          with your imagination. The M4 family of chips features a GPU with a
          second-generation hardware-accelerated ray tracing engine that renders
          images fasters, so{" "}
          <span className="text-white">
            gaming feels more immersive and realistic than ever.{" "}
          </span>{" "}
          And Dynamic Caching optimizes fast on-chip memory to dramatically
          increase average GPU utilization – driving a huge performance boost
          for the most demanding pro apps and games.
        </p>
      </div>
    </section>
  );
};

export default Performance;
