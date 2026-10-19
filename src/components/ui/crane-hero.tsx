"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ==========================================================================
  HERO CONFIGURATION & ASSET PIPELINE
  Frame extraction command (Desktop 192 frames @ 24fps / Mobile 96 @ 12fps):
  ffmpeg -i hero.mp4 -vf "fps=24,scale=1280:-2" -c:v libwebp -quality 78 frames/f_%03d.webp
  ========================================================================== */
const TOTAL_FRAMES = 237;
const FRAME_PATH = (i: number) => `/frames/f_${String(i).padStart(3, "0")}.webp`;
const FALLBACK_PATH = (i: number) => `/frames/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 720;
const PUPIL_X = 0.508;
const PUPIL_Y = 0.472;

export default function CraneHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pupilOverlayRef = useRef<HTMLDivElement>(null);
  const pupilRingRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const micro1Ref = useRef<HTMLDivElement>(null);
  const micro2Ref = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const headlineWordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!canvas || !stage || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let targetIndex = 0;
    let currentIndex = 0;
    let scrollProgress = 0;
    let animationFrameId: number;

    let metrics = {
      sx: 0,
      sy: 0,
      sWidth: SOURCE_WIDTH,
      sHeight: SOURCE_HEIGHT,
      dx: 0,
      dy: 0,
      dWidth: 0,
      dHeight: 0,
    };

    const calculateCrop = (viewW: number, viewH: number) => {
      const sourceRatio = SOURCE_WIDTH / SOURCE_HEIGHT;
      const viewRatio = viewW / viewH;

      let sW: number, sH: number, sX: number, sY: number;

      if (viewRatio > sourceRatio) {
        // Desktop / wide screens: fit width, crop top/bottom
        sW = SOURCE_WIDTH;
        sH = SOURCE_WIDTH / viewRatio;
        sX = 0;
        sY = (SOURCE_HEIGHT - sH) / 2;
      } else {
        // Mobile portrait / tall screens: fit height, crop left/right
        sH = SOURCE_HEIGHT;
        sW = SOURCE_HEIGHT * viewRatio;
        sY = 0;
        // In opening frames, center directly on crane body (x ~ 0.44 on mobile), smoothly tracking to pupil
        const frameRatio = Math.min(currentIndex / 100, 1);
        const openingX = isMobile ? 0.44 : PUPIL_X;
        const focalX = openingX * (1 - frameRatio) + PUPIL_X * frameRatio;
        sX = SOURCE_WIDTH * focalX - sW / 2;
        sX = Math.max(0, Math.min(sX, SOURCE_WIDTH - sW));
      }

      metrics = {
        sx: sX,
        sy: sY,
        sWidth: sW,
        sHeight: sH,
        dx: 0, // Centered crane throughout
        dy: 0,
        dWidth: viewW,
        dHeight: viewH,
      };

      if (pupilOverlayRef.current && pupilRingRef.current) {
        const normX = (SOURCE_WIDTH * PUPIL_X - sX) / sW;
        const normY = (SOURCE_HEIGHT * PUPIL_Y - sY) / sH;

        const pX = normX * viewW;
        const pY = normY * viewH;

        pupilOverlayRef.current.style.left = `${pX}px`;
        pupilOverlayRef.current.style.top = `${pY}px`;
        pupilRingRef.current.style.left = `${pX}px`;
        pupilRingRef.current.style.top = `${pY}px`;

        const maxRadius = Math.hypot(
          Math.max(pX, viewW - pX),
          Math.max(pY, viewH - pY)
        );
        const diameter = maxRadius * 2.5;
        pupilOverlayRef.current.style.width = `${diameter}px`;
        pupilOverlayRef.current.style.height = `${diameter}px`;
        pupilRingRef.current.style.width = `${diameter}px`;
        pupilRingRef.current.style.height = `${diameter}px`;
      }
    };

    const updateDimensions = () => {
      isMobile = window.matchMedia("(max-width: 768px)").matches;
      const viewW = stage.clientWidth;
      const viewH = stage.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = viewW * dpr;
      canvas.height = viewH * dpr;
      canvas.style.width = `${viewW}px`;
      canvas.style.height = `${viewH}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      calculateCrop(viewW, viewH);
      drawFrame(Math.round(currentIndex));
    };

    const drawFrame = (index: number) => {
      const clamped = Math.min(Math.max(index, 0), TOTAL_FRAMES - 1);
      const img = images[clamped];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      ctx.fillStyle = "#0D090C";
      ctx.fillRect(0, 0, metrics.dWidth, metrics.dHeight);

      ctx.drawImage(
        img,
        metrics.sx,
        metrics.sy,
        metrics.sWidth,
        metrics.sHeight,
        metrics.dx,
        metrics.dy,
        metrics.dWidth,
        metrics.dHeight
      );
    };

    const renderLoop = () => {
      const diff = targetIndex - currentIndex;
      if (Math.abs(diff) > 0.01) {
        currentIndex += diff * 0.12;
        if (isMobile) {
          calculateCrop(stage.clientWidth, stage.clientHeight);
        }
        drawFrame(Math.round(currentIndex));
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // Initialize Timeline
    let ctxGsap: gsap.Context;

    const initTimeline = () => {
      if (prefersReducedMotion) return;

      ctxGsap = gsap.context(() => {
        const words = headlineWordsRef.current.filter(Boolean);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: stageRef.current,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scrollProgress = self.progress;
              const frameProgress = Math.min(self.progress / 0.82, 1);
              targetIndex = frameProgress * (TOTAL_FRAMES - 1);
            },
          },
        });

        // STAGE 1: STAND (0-15%) - Scroll cue pulses then fades out
        tl.to(
          scrollCueRef.current,
          { opacity: 0, y: 15, ease: "power2.out", duration: 0.10 },
          0.05
        );

        // STAGE 2: PUSH IN (15-45%) - Headline slides away to the LEFT decisively
        tl.to(
          headlineWrapRef.current,
          {
            xPercent: -130,
            opacity: 0,
            ease: "power2.in",
            duration: 0.28,
          },
          0.15
        );

        tl.to(
          words,
          {
            xPercent: -160,
            opacity: 0,
            stagger: -0.015,
            ease: "power2.in",
            duration: 0.28,
          },
          0.15
        );

        // Micro-copy 1 reveal and fade
        tl.fromTo(
          micro1Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 0.90, y: 0, duration: 0.12, ease: "power2.out" },
          0.28
        );
        tl.to(
          micro1Ref.current,
          { opacity: 0, y: -20, duration: 0.10, ease: "power2.in" },
          0.44
        );

        // STAGE 3: INTO THE EYE & CODE-DRIVEN PUPIL TAKEOVER (55-85%)
        tl.fromTo(
          micro2Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 0.90, y: 0, duration: 0.10, ease: "power2.out" },
          0.55
        );
        tl.to(
          micro2Ref.current,
          { opacity: 0, y: -20, duration: 0.08, ease: "power2.in" },
          0.68
        );

        // Pupil takeover: radial circle expands until screen is pure #0D090C
        tl.fromTo(
          pupilOverlayRef.current,
          { scale: 0.01, opacity: 0 },
          { scale: 1, opacity: 1, ease: "power2.inOut", duration: 0.26 },
          0.62
        );

        // Claret ring pulses outward echoing custom ring cursor
        tl.fromTo(
          pupilRingRef.current,
          { scale: 0.05, opacity: 0 },
          { scale: 0.65, opacity: 0.75, ease: "power1.out", duration: 0.14 },
          0.66
        );
        tl.to(
          pupilRingRef.current,
          { scale: 1.15, opacity: 0, ease: "power2.out", duration: 0.14 },
          0.76
        );

        // STAGE 4: HANDOFF (85-100%) - Subline and CTA fade up in pure darkness
        tl.fromTo(
          handoffRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.14,
            onStart: () => {
              if (handoffRef.current) handoffRef.current.style.pointerEvents = "auto";
            },
            onReverseComplete: () => {
              if (handoffRef.current) handoffRef.current.style.pointerEvents = "none";
            },
          },
          0.84
        );
      }, containerRef);
    };

    updateDimensions();
    initTimeline();
    animationFrameId = requestAnimationFrame(renderLoop);

    // Preload frame sequence with fallback support
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
        if (i === 1) drawFrame(0);
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
          ScrollTrigger.refresh();
        }
      };
      img.onerror = () => {
        img.src = FALLBACK_PATH(i);
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
          if (i === 1) drawFrame(0);
          if (loadedCount === TOTAL_FRAMES) {
            setIsLoaded(true);
            ScrollTrigger.refresh();
          }
        };
      };
      images.push(img);
    }

    const onResize = () => {
      isMobile = window.matchMedia("(max-width: 768px)").matches;
      updateDimensions();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrameId);
      if (ctxGsap) ctxGsap.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero"
      className="hero-container relative w-full text-[#F3E9DC]"
      style={{
        height: "400vh",
        background: "#0D090C",
        // @ts-expect-error CSS variable custom properties
        "--bg": "#0D090C",
        "--cream": "#F3E9DC",
        "--claret": "#8B1E32",
        "--blue": "#8FB4D9",
      }}
    >
      <style>{`
        #hero {
          --bg: #0D090C;
          --cream: #F3E9DC;
          --claret: #8B1E32;
          --blue: #8FB4D9;
        }

        #hero .hero-canvas {
          mix-blend-mode: lighten;
          filter: contrast(1.06) saturate(1.05);
          pointer-events: none;
        }

        #hero .hero-grain {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          pointer-events: none;
          opacity: 0.07;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: heroGrainShift 0.7s steps(4) infinite;
        }

        @keyframes heroGrainShift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-3%, -2%); }
          50% { transform: translate(2%, 3%); }
          75% { transform: translate(-2%, 4%); }
          100% { transform: translate(3%, -1%); }
        }

        @keyframes heroCuePulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, 0); }
          50% { opacity: 0.9; transform: translate(-50%, 5px); }
        }

        @media (prefers-reduced-motion: reduce) {
          #hero {
            height: auto !important;
          }
          #hero .hero-stage-pinned {
            height: auto !important;
            min-height: 100vh;
            padding: 6rem 2rem;
          }
          #hero .hero-canvas-wrap {
            display: none !important;
          }
          #hero .hero-static-poster {
            display: block !important;
            opacity: 0.4;
          }
          #hero .hero-handoff-layer {
            position: relative !important;
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
            margin-top: 4rem;
          }
          #hero .hero-scroll-cue,
          #hero .hero-pupil-overlay,
          #hero .hero-pupil-ring {
            display: none !important;
          }
        }
      `}</style>

      {/* 100vh Sticky/Pinned Viewport Stage */}
      <div
        ref={stageRef}
        id="heroStage"
        className="hero-stage-pinned sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-[#0D090C] flex items-center justify-center"
      >
        {/* Minimal Loader */}
        <div
          className={`absolute top-6 right-8 z-30 font-mono text-[11px] tracking-[0.25em] text-[#8FB4D9] transition-opacity duration-500 pointer-events-none ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          LOADING {loadingProgress}%
        </div>

        {/* Canvas Render Layer */}
        <div className="hero-canvas-wrap absolute inset-0 w-full h-full z-[1] overflow-hidden bg-[#0D090C]">
          <canvas
            ref={canvasRef}
            className="hero-canvas absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block"
            aria-label="Cinematic crane animation pushing into its eye"
          />
          {/* Static poster fallback */}
          <img
            src="/frames/f_001.webp"
            alt="Crane mascot in darkness"
            className="hero-static-poster hidden absolute inset-0 w-full h-full object-cover mix-blend-lighten pointer-events-none"
          />
        </div>

        {/* Faint Vignette & Animated Film Grain */}
        <div
          className="hero-vignette absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(13,9,12,0.75) 100%)",
          }}
        />
        <div className="hero-grain z-[6]" />

        {/* Code-driven Pupil Takeover and Claret Pulse Ring */}
        <div
          ref={pupilOverlayRef}
          className="hero-pupil-overlay absolute z-[10] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{
            background: "radial-gradient(circle, #0D090C 80%, rgba(13,9,12,0.98) 95%, transparent 100%)",
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />
        <div
          ref={pupilRingRef}
          className="hero-pupil-ring absolute z-[11] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 border-[1.5px] border-[#8B1E32] opacity-0"
          style={{
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />

        {/* Subtle bottom fade for mobile headline readability without touching crane head */}
        <div
          className="hero-bottom-fade absolute inset-x-0 bottom-0 h-48 md:h-36 z-[12] pointer-events-none bg-gradient-to-t from-[#0D090C] via-[#0D090C]/80 to-transparent"
        />

        {/* Editorial Layout: Headline anchored at bottom-left */}
        <div className="hero-content-layer absolute inset-0 z-[15] flex justify-start items-end p-5 sm:p-8 md:p-14 lg:p-20 pb-20 sm:pb-24 md:pb-20 lg:pb-24 pointer-events-none">
          <div
            ref={headlineWrapRef}
            className="hero-headline-wrap w-full max-w-xl md:max-w-2xl flex flex-col justify-end will-change-transform"
          >
            <h1 className="hero-headline text-[clamp(1.65rem,7.5vw,5rem)] font-black tracking-[-0.03em] uppercase text-[#F3E9DC] leading-[0.92] text-left">
              {["WE", "MAKE", "BRANDS"].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top">
                  <span
                    ref={(el) => (headlineWordsRef.current[i] = el)}
                    className="hero-word inline-block will-change-transform"
                  >
                    {word}
                  </span>
                </span>
              ))}
              {["IMPOSSIBLE", "TO", "IGNORE"].map((word, i) => (
                <span key={i + 3} className="inline-block overflow-hidden mr-[0.25em] align-top">
                  <span
                    ref={(el) => (headlineWordsRef.current[i + 3] = el)}
                    className="hero-word inline-block text-[#8B1E32] will-change-transform"
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* Micro-Narrative Line 1 */}
        <div
          ref={micro1Ref}
          className="hero-micro-right absolute right-5 sm:right-8 md:right-20 top-[35%] max-w-[280px] sm:max-w-[320px] text-xs md:text-sm leading-relaxed tracking-wider text-right text-[#F3E9DC] opacity-0 pointer-events-none z-[15]"
        >
          Hyper-focused instinct. Precision-engineered brand dominance in the modern digital landscape.
        </div>

        {/* Micro-Narrative Line 2 */}
        <div
          ref={micro2Ref}
          className="hero-micro-left absolute left-5 sm:left-8 md:left-20 top-[30%] max-w-[240px] sm:max-w-[280px] text-xs md:text-sm leading-relaxed tracking-wider text-left text-[#8FB4D9] opacity-0 pointer-events-none z-[15]"
        >
          Perception dialed to absolute clarity.
        </div>

        {/* Phase 1 Scroll Indicator */}
        <div
          ref={scrollCueRef}
          className="hero-scroll-cue absolute bottom-3 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[16] flex flex-col items-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#F3E9DC]/70 pointer-events-none"
          style={{ animation: "heroCuePulse 2.4s ease-in-out infinite" }}
        >
          <span>SCROLL</span>
          <div className="w-[1px] h-5 sm:h-7 bg-gradient-to-b from-[#F3E9DC] to-transparent" />
        </div>

        {/* Phase 4 Handoff: Pure Editorial Small Text Lockup out of pure #0D090C */}
        <div
          ref={handoffRef}
          className="hero-handoff-layer absolute inset-0 z-[20] flex flex-col items-center justify-center text-center px-6 md:px-12 opacity-0 pointer-events-none"
        >
          <div className="text-[11px] md:text-xs font-semibold tracking-[0.35em] uppercase text-[#8FB4D9] mb-4">
            SOCIALYZZZE — DIGITAL GROWTH & CULTURE
          </div>
          <p className="hero-subline text-base md:text-2xl font-light text-[#F3E9DC] max-w-2xl leading-relaxed tracking-tight mb-8">
            Uncompromising brand identity, storytelling, and digital architecture.
          </p>
          <div className="flex items-center gap-3 text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase text-[#F3E9DC]/50">
            <span>DISCOVER OUR WORK</span>
            <span className="text-[#8B1E32]">↓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
