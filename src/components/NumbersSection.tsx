import React, { useRef, useEffect, useState } from "react";
import { TrendingUp, Eye } from "lucide-react";
import { Card3DList, CardData } from "@/components/ui/animated-3d-card";

function useCountUp(target: string, inView: boolean) {
  const [value, setValue] = useState("0");

  useEffect(() => {
    if (!inView) return;

    // Split e.g. "20M+" -> number "20", suffix "M+"
    const match = target.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setValue(target);
      return;
    }
    const numericTarget = parseFloat(match[1]);
    const suffix = match[2];
    const hasDecimal = match[1].includes(".");
    const duration = 2000;
    const startTime = performance.now();
    let frame: number;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = numericTarget * eased;

      setValue((hasDecimal ? current.toFixed(1) : String(Math.floor(current))) + suffix);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, inView]);

  return value;
}

function AnimatedTitle({ target, inView }: { target: string; inView: boolean }) {
  const animatedValue = useCountUp(target, inView);
  return <>{animatedValue}</>;
}

export function NumbersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <TrendingUp />,
      value: "4.2x",
      label: "Average Engagement",
      subtext: "Higher engagement across the campaigns we run for our clients",
      theme: "primary",
    },
    {
      icon: <Eye />,
      value: "20M+",
      label: "Views Generated",
      subtext: "Total views delivered across client content and campaigns",
      theme: "secondary",
    },
  ];

  const cards: CardData[] = stats.map((stat, idx) => ({
    id: idx,
    icon: stat.icon,
    theme: stat.theme as any,
    title: (
      <span className="text-4xl md:text-5xl font-black font-display block normal-case">
        <AnimatedTitle target={stat.value} inView={inView} />
      </span>
    ),
    description: (
      <div className="flex flex-col gap-2 mt-2">
        <span className="text-sm font-bold text-whispy-light uppercase">{stat.label}</span>
        <span className="text-xs text-buttercream/65 leading-relaxed normal-case">{stat.subtext}</span>
      </div>
    ),
  }));

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 px-5 sm:px-6 md:px-16 bg-[#160E12] border-t border-b border-buttercream/10 text-buttercream">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-20">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-[0.3em] text-whispy-light font-bold block mb-3">
              Who We Are
            </span>
            <h2 className="text-[clamp(1.65rem,6.8vw,3.75rem)] md:text-6xl font-extrabold font-display text-buttercream leading-[1.05] uppercase">
              TURNING ATTENTION <br />
              <span className="text-blood-accent">INTO MEASURABLE IMPACT.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-buttercream/75 text-lg font-normal leading-relaxed">
              Socialyzzze is a digital growth agency helping brands grow through social media, creative content, performance marketing, and web solutions. From strategy to execution, we turn your online presence into a brand that connects, engages, and converts.
            </p>
          </div>
        </div>

        <div className="w-full relative z-10 max-w-3xl mx-auto">
          <Card3DList
            cards={cards}
            columns={2}
            gap="md"
            size="md"
            variant="premium"
          />
        </div>
      </div>
    </section>
  );
}

export default NumbersSection;