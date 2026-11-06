import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { NumbersSection } from "@/components/NumbersSection";
import { WorksSection, VisualPhotoExhibition } from "@/components/WorksSection";
import { WorkCategories } from "@/components/WorkCategories";
import { WorkCategoryPage } from "@/components/WorkCategoryPage";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { ProcessSection } from "@/components/ProcessSection";
import BrandsSection from "@/components/BrandsSection";
import { TeamSection } from "@/components/TeamSection";
import { ContactSection } from "@/components/ContactSection";
import { FooterSection } from "@/components/FooterSection";
import { PrivacyPolicy } from "@/components/PrivacyPolicy";
import { PrivacyBanner } from "@/components/PrivacyBanner";
import { findCategory } from "@/data/videos";

const PRIVACY_HASH = "#privacy-policy";
const WORK_PREFIX = "#work/";

const CLIP_CLOSED_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const CLIP_CLOSED_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

// A route is "home", the privacy hash, or a valid "#work/<slug>" hash.
const getRoute = (): string => {
  const h = window.location.hash;
  if (h === PRIVACY_HASH) return h;
  if (h.startsWith(WORK_PREFIX) && findCategory(h.slice(WORK_PREFIX.length))) return h;
  return "home";
};

const labelFor = (route: string): string => {
  if (route === PRIVACY_HASH) return "Privacy Policy";
  if (route.startsWith(WORK_PREFIX)) return findCategory(route.slice(WORK_PREFIX.length))?.name ?? "Work";
  return "Socialyzzze";
};

export function App() {
  const [route, setRoute] = useState(getRoute());
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const targetRef = useRef(getRoute());
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const swapPage = (next: string) => {
      setRoute(next);
      window.scrollTo(0, 0);
      // coming back to the home page: jump to the section named in the hash
      if (next === "home" && window.location.hash.length > 1) {
        window.setTimeout(() => {
          try {
            document.querySelector(window.location.hash)?.scrollIntoView();
          } catch {
            /* not a valid selector, stay at top */
          }
        }, 80);
      }
    };

    const onHashChange = () => {
      const next = getRoute();
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

      label.textContent = labelFor(next);

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

  const category = route.startsWith(WORK_PREFIX) ? findCategory(route.slice(WORK_PREFIX.length)) : undefined;

  return (
    <div className="min-h-screen bg-[#0E090B] text-buttercream antialiased selection:bg-blood-accent selection:text-buttercream">
      <CustomCursor />
      {route === PRIVACY_HASH ? (
        <PrivacyPolicy />
      ) : category ? (
        <WorkCategoryPage category={category} />
      ) : (
        <>
          <Navigation />
          <main>
            <HeroSection />
            <NumbersSection />
            <WorksSection />
            <WorkCategories />
            <VisualPhotoExhibition />
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