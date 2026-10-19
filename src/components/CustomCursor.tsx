"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Things the cursor reacts to. Add data-cursor="Play" to any element to give it a custom label.
const INTERACTIVE =
  'a, button, [role="button"], [role="option"], summary, label[for], [data-cursor]';
// Places where the normal text cursor should come back
const TEXT_FIELD =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, [contenteditable="true"]';

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState("");

  // Dot follows the pointer exactly; ring trails behind with a spring
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  // Only on devices with a real mouse (not phones/tablets)
  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target instanceof Element ? e.target : null;
      const overText = !!el?.closest(TEXT_FIELD);
      setVisible(!overText);

      const hit = el?.closest(INTERACTIVE) ?? null;
      setHovering(!!hit && !overText);
      setLabel(
        hit?.getAttribute("data-cursor") ??
          (hit?.getAttribute("role") === "option" ? "View" : ""),
      );
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = hovering ? (label ? 84 : 56) : 34;

  return (
    <>
      {/* Hides the normal cursor everywhere except text fields */}
      <style>{`
        html.has-custom-cursor,
        html.has-custom-cursor *:not(input):not(textarea):not(select):not([contenteditable="true"]) {
          cursor: none !important;
        }
      `}</style>

      {/* Dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x, y }}
      >
        <motion.div
          className="absolute -top-1 -left-1 size-2 rounded-full bg-buttercream mix-blend-difference"
          animate={{
            opacity: visible && !hovering ? 1 : 0,
            scale: pressed ? 0.6 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{ x: ringX, y: ringY }}
      >
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className={cn(
              "flex items-center justify-center rounded-full",
              hovering
                ? "bg-blood-accent text-buttercream-light"
                : "border border-buttercream/70 mix-blend-difference",
            )}
            animate={{
              width: size,
              height: size,
              opacity: visible ? 1 : 0,
              scale: pressed ? 0.85 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            {hovering && label ? (
              <span className="font-display text-[11px] font-black tracking-wider uppercase">
                {label}
              </span>
            ) : null}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default CustomCursor;
