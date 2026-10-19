import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { NumbersSection } from "@/components/NumbersSection";
import { WorksSection } from "@/components/WorksSection";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSection } from "@/components/ProcessSection";
import BrandsSection from "@/components/BrandsSection";
import { TeamSection } from "@/components/TeamSection";
import { ContactSection } from "@/components/ContactSection";
import { FooterSection } from "@/components/FooterSection";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { PrivacyBanner } from "@/components/PrivacyBanner";

const PRIVACY_HASH = "#privacy-policy";

const CLIP_CLOSED_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const CLIP_CLOSED_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

export function App() {
  const [showPrivacy, setShowPrivacy] = useState(window.location.hash === PRIVACY_HASH);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const targetRef = useRef(window.location.hash === PRIVACY_HASH);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const swapPage = (next: boolean) => {
      setShowPrivacy(next);
      window.scrollTo(0, 0);
    };

    const onHashChange = () => {
      const next = window.location.hash === PRIVACY_HASH;
      if (next === targetRef.current) return;
      targetRef.current = next;

      timelineRef.current?.kill();

      const overlay = overlayRef.current;
      const label = labelRef.current;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!overlay || !label || reduceMotion) {
        swapPage(next);
        return;
      }

      label.textContent = next ? "Privacy Policy" : "Socialyzzze";

      const timeline = gsap.timeline();
      timeline
        .set(overlay, { display: "flex", pointerEvents: "auto", clipPath: CLIP_CLOSED_BOTTOM })
        .set(label, { opacity: 0, y: 24 })
        .to(overlay, { clipPath: CLIP_OPEN, duration: 0.7, ease: "power4.inOut" })
        .to(label, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.25")
        .call(() => swapPage(next))
        .to(label, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" }, "+=0.25")
        .to(overlay, { clipPath: CLIP_CLOSED_TOP, duration: 0.7, ease: "power4.inOut" }, "-=0.1")
        .set(overlay, { display: "none", pointerEvents: "none" });

      timelineRef.current = timeline;
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0E090B] text-buttercream antialiased selection:bg-blood-accent selection:text-buttercream">
      <CustomCursor />
      {showPrivacy ? (
        <PrivacyPolicy />
      ) : (
        <>
          <Navigation />
          <main>
            <HeroSection />
            <NumbersSection />
            <WorksSection />
            <ServicesSection />
            <AboutSection />
            <ProcessSection />
            <BrandsSection />
            <TeamSection />
            <ContactSection />
          </main>
          <FooterSection />
          <PrivacyBanner />
        </>
      )}

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] items-center justify-center bg-blood-accent"
        style={{ display: "none", clipPath: CLIP_CLOSED_BOTTOM }}
      >
        <span
          ref={labelRef}
          className="font-display text-3xl font-black uppercase tracking-tight text-buttercream sm:text-6xl"
        />
      </div>
    </div>
  );
}

export default App;