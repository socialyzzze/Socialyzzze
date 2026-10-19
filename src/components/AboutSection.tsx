import React from "react";
import { Users, Award, ShieldCheck, ArrowUpRight } from "lucide-react";
import KineticTeamHybrid from "@/components/ui/kinetic-team-hybrid";
import { ScrollChoreography } from "@/components/ui/scroll-choreography";

export function AboutSection() {

  return (
    <>
      <section id="about" className="pt-20 sm:pt-32 px-5 sm:px-6 md:px-16 bg-[#0E090B] text-buttercream">
        <div className="max-w-7xl mx-auto">
          {/* Top Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-20">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-whispy-light font-bold block mb-2 sm:mb-3">
                Agency Story & Manifesto
              </span>
              <h2 className="text-[clamp(1.85rem,7.5vw,3.75rem)] md:text-6xl font-black font-display text-buttercream uppercase tracking-tight leading-[0.95]">
                BUILT FOR THE <br />
                <span className="text-blood-accent">FEED-FIRST WORLD</span>
              </h2>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-end space-y-4">
              <p className="text-buttercream/75 text-sm sm:text-base font-normal leading-relaxed">
                Socialyzzze is a creative marketing agency. We fuse strategy, creative direction, film-grade content, and modern web engineering under one roof — so every campaign pulls in the exact same high-impact direction.
              </p>
              <p className="text-buttercream font-bold text-xs sm:text-sm uppercase font-mono">
                No filler. No generic templates. Just work built to command unmistakable attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Growth Equation - Header */}
      <div className="bg-[#0E090B] w-full pt-8 sm:pt-12 pb-16 sm:pb-24 flex items-center justify-center px-4">
        <div className="text-center opacity-90 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <h3 className="text-[clamp(1.5rem,8.2vw,4.5rem)] md:text-8xl lg:text-[10rem] font-display font-black uppercase text-buttercream leading-[0.88] tracking-tighter">
            THE <br /> EQUATION
          </h3>
        </div>
      </div>

      {/* Animated Scroll Choreography */}
      <section className="bg-[#0E090B] border-b border-buttercream/10 w-full relative">
        <ScrollChoreography
          images={{
            topLeft: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", // Strategy
            bottomRight: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop", // Creative
            bottomLeft: "https://images.unsplash.com/photo-1498661694102-0a3793edbe74?q=80&w=2070&auto=format&fit=crop", // Content
            topRight: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Technology / Hero
          }}
          labels={{
            topLeft: "Strategy",
            bottomRight: "Creativity",
            bottomLeft: "Content",
            topRight: "Technology",
            final: "Attention"
          }}
        />
      </section>
    </>
  );
}

export default AboutSection;
