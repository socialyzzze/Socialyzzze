"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  title: string;
  image: string;
  href?: string;
  isVideo?: boolean;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  label?: string;
  /** No longer used: the hover action button has been removed. */
  action?: string;
}

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;

const WHEEL_UNITS = 500;
const DRAG_UNITS = 300;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Works '26",
  action: _action,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const settling = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const isMobile = w > 0 && w < 768;
    const cardW = isMobile
      ? Math.min(h * 0.44 * CARD_RATIO, w * 0.52)
      : Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * (isMobile ? 2.4 : DRUM);
    const ringR = cardH * (isMobile ? 1.4 : RING_R);
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = pos - i;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) {
          let itemScale = lerp(ringScale, 1, m);
          // Smoothly ramp focus boost as m goes from 0.5 to 1
          const focusFactor = clamp((m - 0.5) / 0.5, 0, 1);
          const dist = Math.abs(d);
          const focusBoost = Math.max(0, 1 - dist) * 0.85 * focusFactor;
          itemScale += focusBoost;
          face.style.transform = `scale(${itemScale})`;
          face.style.transition = "transform 0.3s ease-out";
        }
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  // WHEEL: the wheel drives the videos anywhere over the stage.
  // The page only scrolls when the wheel is already at the first/last video
  // and the user keeps scrolling in that same direction.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      // Normalise line/page based wheels (Firefox, some mice) to pixels
      const unit =
        event.deltaMode === 1 ? 33 : event.deltaMode === 2 ? el.clientHeight : 1;
      const dy = event.deltaY * unit;
      if (dy === 0) return;

      // Is the cursor over the videos? Use the combined box of every visible card
      // (so the small gaps between tilted cards don't count as "outside").
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const card of cardRefs.current) {
        if (!card || card.style.opacity === "0") continue;
        const face = (card.firstElementChild as HTMLElement | null) ?? card;
        const r = face.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        minX = Math.min(minX, r.left);
        minY = Math.min(minY, r.top);
        maxX = Math.max(maxX, r.right);
        maxY = Math.max(maxY, r.bottom);
      }
      const overVideos =
        event.clientX >= minX &&
        event.clientX <= maxX &&
        event.clientY >= minY &&
        event.clientY <= maxY;
      if (!overVideos) return; // cursor is on empty space: let the page scroll

      const atStart = target.current <= 0 && dy < 0;
      const atEnd = target.current >= last + 1 && dy > 0;
      if (atStart || atEnd) return; // hand control back to the page

      // Take over: stop the page scrolling AND stop smooth-scroll libraries
      // (Lenis etc. listen on window) from seeing this event.
      event.preventDefault();
      event.stopPropagation();

      to(target.current + dy / WHEEL_UNITS);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  const drag = React.useRef<number | null>(null);
  const dragStart = React.useRef<number | null>(null);

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-[#0E090B] text-buttercream relative h-full min-h-[30rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-buttercream absolute inset-0 cursor-grab touch-pan-x overscroll-contain outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          dragStart.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
          drag.current = event.clientY;
        }}
        onPointerUp={(event) => {
          if (dragStart.current !== null) {
            const diff = dragStart.current - event.clientY;
            if (Math.abs(diff) < 5) {
              // It's a click! Open the currently active video
              setExpandedIndex(active);
            }
          }
          drag.current = null;
          dragStart.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const Tag = (item.href ? "a" : "div") as "a";
            const isVid =
              item.isVideo ||
              item.image.endsWith(".MP4") ||
              item.image.endsWith(".MOV") ||
              item.image.endsWith(".mp4") ||
              item.image.endsWith(".mov");
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={i === active}
                  href={item.href}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  className="group absolute [backface-visibility:hidden] cursor-pointer"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="bg-dark-card relative block size-full overflow-hidden">
                    {isVid ? (
                      <video
                        src={item.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="size-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        draggable={false}
                        className="size-full object-cover"
                      />
                    )}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-display font-bold text-buttercream"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>

      {/* Blue active-title: pinned to the LEFT, vertically centred on the video row on desktop */}
      <div
        ref={titleRef}
        className="hidden md:flex pointer-events-none absolute top-1/2 -translate-y-1/2 left-[3%] tracking-tight font-display font-black text-whispy opacity-0 uppercase flex-col items-start text-left z-[50]"
        style={{
          fontSize: `clamp(2rem, ${metrics.title * 1.8}px, 5rem)`,
          lineHeight: 0.95,
        }}
      >
        {items[active]?.title.split(" ").map((word, i) => (
          <span key={i} className="block">
            {word}
          </span>
        ))}
      </div>

      {/* Index list: top right (desktop only) */}
      <ol
        className="hidden md:block text-buttercream/60 absolute top-[7.5%] right-[3%] text-right leading-[1.75] z-[40]"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              className={cn(
                "cursor-pointer transition-colors outline-none focus-visible:outline-1 focus-visible:outline-buttercream hover:text-blood-accent",
                i === active && "text-blood-accent font-semibold",
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Mobile active project indicator below the ring */}
      <div className="md:hidden absolute bottom-3 inset-x-0 z-[40] flex flex-col items-center text-center px-6 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blood-accent font-bold mb-0.5">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <h4 className="text-[15px] font-display font-black uppercase text-buttercream tracking-tight max-w-[280px] drop-shadow-md leading-snug">
          {items[active]?.title}
        </h4>
        <span className="text-[10px] font-mono text-whispy-light/70 uppercase tracking-widest mt-0.5">
          Tap card to view
        </span>
      </div>

      {/* Expanded Modal — split layout with slide-in animation */}
      <style>{`
        @keyframes ww-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ww-slide-left { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes ww-slide-right { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      {expandedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[#0E090B]/95 backdrop-blur-xl cursor-pointer"
          style={{ animation: "ww-overlay-in 0.4s ease-out both" }}
          onClick={() => setExpandedIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-[110] bg-buttercream/10 text-buttercream hover:text-white rounded-full p-3 hover:bg-blood-accent transition-all duration-300 backdrop-blur-md"
            onClick={() => setExpandedIndex(null)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="h-full w-full flex flex-col md:flex-row items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side — Title text, each word on its own line */}
            <div
              className="w-full md:w-1/2 h-1/3 md:h-full flex items-center justify-center px-8 md:px-16"
              style={{ animation: "ww-slide-left 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
            >
              <div className="flex flex-col items-start">
                {items[expandedIndex].title.split(" ").map((word, wi) => (
                  <span
                    key={wi}
                    className="block font-display font-black uppercase tracking-tight text-whispy leading-[0.92]"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3.8rem)" }}
                  >
                    {word}
                  </span>
                ))}
                <span className="mt-6 block text-xs uppercase tracking-[0.35em] text-whispy/60 font-semibold">
                  {String(expandedIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Right side — Vertical video, fully visible, no black bars */}
            <div
              className="w-full md:w-1/2 h-2/3 md:h-full flex items-center justify-center p-4 md:p-10"
              style={{ animation: "ww-slide-right 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}
            >
              <div className="relative h-full max-h-[85vh] aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-buttercream/8">
                {items[expandedIndex].isVideo ||
                  items[expandedIndex].image.match(/\.(mp4|mov|webm)$/i) ? (
                  <video
                    src={items[expandedIndex].image}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={items[expandedIndex].image}
                    alt={items[expandedIndex].title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default WorksWheel;