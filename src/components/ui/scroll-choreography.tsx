"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrollChoreographyProps {
  className?: string;
  images: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  labels: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    final: string;
  };
}

// Defined OUTSIDE the component so it isn't re-created (and remounted) on every render
const OverlayText = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-1 sm:p-2">
    <span className="text-[clamp(8px,2.3vw,11px)] sm:text-lg md:text-2xl lg:text-4xl font-display font-black text-buttercream tracking-wider sm:tracking-tight uppercase drop-shadow-lg text-center whitespace-nowrap px-1">
      {children}
    </span>
  </div>
);

// Look shared by every card (no positioning here)
const cardLook =
  "overflow-hidden bg-[#1C1217] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-buttercream/10";

// The three small cards are absolutely centered, then offset with framer-motion x/y
const smallCardClasses = cn(
  cardLook,
  "absolute inset-0 m-auto w-[40vw] max-w-[170px] sm:w-[35vw] sm:max-w-none h-[22vh] sm:h-[24vh] rounded-xl sm:rounded-2xl"
);

export function ScrollChoreography({
  className,
  images,
  labels,
}: ScrollChoreographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001,
  });

  // Default positions relative to center
  const xLeft = "-18vw";
  const xRight = "18vw";
  const yTop = "-16vh";
  const yBottom = "16vh";

  // Phase 1: 0 - 0.3   (diagonal swap)
  // Phase 2: 0.35 - 0.65 (stack to center)
  // Phase 3: 0.65 - 0.9  (hero expands to full screen)
  const keys = [0, 0.3, 0.35, 0.65, 1];

  // Top Left -> moves to bottom left, then center
  const tlX = useTransform(smoothProgress, keys, [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const tlY = useTransform(smoothProgress, keys, [yTop, yBottom, yBottom, "0vh", "0vh"]);

  // Bottom Right -> moves to top right, then center
  const brX = useTransform(smoothProgress, keys, [xRight, xRight, xRight, "0vw", "0vw"]);
  const brY = useTransform(smoothProgress, keys, [yBottom, yTop, yTop, "0vh", "0vh"]);

  // Bottom Left -> stays, then center
  const blX = useTransform(smoothProgress, keys, [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const blY = useTransform(smoothProgress, keys, [yBottom, yBottom, yBottom, "0vh", "0vh"]);

  // Top Right (hero) -> stays, then center, then expands
  const trX = useTransform(smoothProgress, keys, [xRight, xRight, xRight, "0vw", "0vw"]);
  const trY = useTransform(smoothProgress, keys, [yTop, yTop, yTop, "0vh", "0vh"]);

  const [initialCardW, setInitialCardW] = useState("35vw");

  useEffect(() => {
    if (window.innerWidth < 640) {
      setInitialCardW("40vw");
    }
  }, []);

  // Hero expansion
  const heroWidth = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], [initialCardW, initialCardW, "100vw", "100vw"]);
  const heroHeight = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ["24vh", "24vh", "100vh", "100vh"]);
  const heroRadius = useTransform(smoothProgress, [0.7, 0.9], ["16px", "0px"]);

  // Cards underneath fade out as the hero expands
  const underImagesOpacity = useTransform(smoothProgress, [0.75, 0.85], [1, 0]);

  // Label crossfade on the hero (Technology -> final word)
  const initialLabelOpacity = useTransform(smoothProgress, [0.75, 0.85], [1, 0]);
  const finalLabelOpacity = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);
  const finalLabelScale = useTransform(smoothProgress, [0.75, 0.9, 1], [0.8, 1, 1]);

  return (
    <div ref={containerRef} className={cn("relative h-[350vh] w-full", className)}>
      {/* Sticky stage. Flex centering means anything inside (even wider than the screen)
          stays truly centered, instead of being pinned left like absolute + m-auto. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* The three small cards live in their own constrained, absolutely-positioned layer */}
        <div className="absolute inset-0 mx-auto w-full max-w-7xl">
          {/* Top Left */}
          <motion.div
            style={{ x: tlX, y: tlY, opacity: underImagesOpacity }}
            className={cn(smallCardClasses, "z-10")}
          >
            <img src={images.topLeft} alt={labels.topLeft} className="h-full w-full object-cover" />
            <OverlayText>{labels.topLeft}</OverlayText>
          </motion.div>

          {/* Bottom Right */}
          <motion.div
            style={{ x: brX, y: brY, opacity: underImagesOpacity }}
            className={cn(smallCardClasses, "z-20")}
          >
            <img src={images.bottomRight} alt={labels.bottomRight} className="h-full w-full object-cover" />
            <OverlayText>{labels.bottomRight}</OverlayText>
          </motion.div>

          {/* Bottom Left */}
          <motion.div
            style={{ x: blX, y: blY, opacity: underImagesOpacity }}
            className={cn(smallCardClasses, "z-30")}
          >
            <img src={images.bottomLeft} alt={labels.bottomLeft} className="h-full w-full object-cover" />
            <OverlayText>{labels.bottomLeft}</OverlayText>
          </motion.div>
        </div>

        {/* Hero card: a normal flex child of the full-width stage (NOT inside max-w-7xl),
            so it centers on the screen and grows evenly in every direction. */}
        <motion.div
          style={{
            x: trX,
            y: trY,
            width: heroWidth,
            height: heroHeight,
            borderRadius: heroRadius,
          }}
          className={cn(cardLook, "relative z-40 shrink-0 max-w-none")}
        >
          <img src={images.topRight} alt={labels.topRight} className="h-full w-full object-cover" />

          {/* Initial label (e.g. Technology) */}
          <motion.div
            style={{ opacity: initialLabelOpacity }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-1 sm:p-2"
          >
            <span className="text-[clamp(8px,2.3vw,11px)] sm:text-lg md:text-2xl lg:text-4xl font-display font-black text-buttercream tracking-wider sm:tracking-tight uppercase drop-shadow-lg text-center whitespace-nowrap px-1">
              {labels.topRight}
            </span>
          </motion.div>

          {/* Final label (e.g. Attention) — sized by viewport width so it always fits */}
          <motion.div
            style={{ opacity: finalLabelOpacity, scale: finalLabelScale }}
            className="absolute inset-0 bg-blood-accent/70 flex items-center justify-center backdrop-blur-sm px-4"
          >
            <span className="whitespace-nowrap text-[clamp(1.75rem,8vw,10rem)] font-display font-black text-buttercream tracking-tighter uppercase leading-none text-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {labels.final}
            </span>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

export default ScrollChoreography;