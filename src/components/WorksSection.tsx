import React from "react";
import { WorksWheel, WorksWheelItem } from "@/components/ui/works-wheel";
import { LiquidGlassCarousel, LiquidGlassCarouselItem } from "@/components/ui/liquid-glass-carousel";

const VIDEO_WORKS: WorksWheelItem[] = [
  {
    title: "Automotive Motion Campaign",
    image: "/works/works1.MP4",
    href: "#video-1",
    isVideo: true,
  },
  {
    title: "Luxury Detailing Showcase",
    image: "/works/works2.MOV",
    href: "#video-2",
    isVideo: true,
  },
  {
    title: "Feed-First Visual Identity",
    image: "/works/works3.MOV",
    href: "#video-3",
    isVideo: true,
  },
  {
    title: "High Velocity Reel Edit",
    image: "/works/works4.MOV",
    href: "#video-4",
    isVideo: true,
  },
  {
    title: "Bespoke Creative Direction",
    image: "/works/works5.MOV",
    href: "#video-5",
    isVideo: true,
  },
  {
    title: "Cinematic Brand Reveal",
    image: "/works/works6.MOV",
    href: "#video-6",
    isVideo: true,
  },
  {
    title: "Social First Production",
    image: "/works/works7.MOV",
    href: "#video-7",
    isVideo: true,
  },
  {
    title: "Modern Aesthetic Campaign",
    image: "/works/works8.MOV",
    href: "#video-8",
    isVideo: true,
  },
  {
    title: "Digital Narrative Showcase",
    image: "/works/works9.MOV",
    href: "#video-9",
    isVideo: true,
  },
];

const PHOTO_WORKS: LiquidGlassCarouselItem[] = [
  {
    title: "Premium Car Detailing Key Art",
    src: "/works/imageworks1.PNG",
    aspect: 0.75,
  },
  {
    title: "Jewellery Portrait",
    src: "/works/jewellery-portrait.jpg",
    aspect: 0.75,
  },
  {
    title: "Diamond Launch Teaser",
    src: "/works/diamond-teaser.jpg",
    aspect: 0.8,
  },
  {
    title: "Yuzu Mango Tequila",
    src: "/works/yuzu-cocktail.jpg",
    aspect: 0.8,
  },
  {
    title: "Textures of Things I Love",
    src: "/works/textures.jpg",
    aspect: 0.75,
  },
  {
    title: "Jewellery on a Fork",
    src: "/works/jewellery-fork.jpg",
    aspect: 0.64,
  },
  {
    title: "Fragrant Chilli Chicken",
    src: "/works/chilli-chicken.jpg",
    aspect: 0.8,
  },
  {
    title: "Trick or Eat",
    src: "/works/trick-or-eat.jpg",
    aspect: 0.8,
  },
];

export function WorksSection() {
  return (
    <section id="works" className="relative py-20 sm:py-28 bg-[#0E090B] border-b border-buttercream/10 text-buttercream">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-16 mb-4 sm:mb-8 md:mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-whispy-light font-bold block mb-2 sm:mb-3">
          Selected Works
        </span>
        <h2 className="text-[clamp(1.5rem,6.2vw,3rem)] md:text-5xl font-black font-display text-buttercream uppercase tracking-tight">
          FEATURED VIDEO PRODUCTIONS
        </h2>
      </div>

      <div className="w-full h-[460px] sm:h-[540px] md:h-[620px] relative mb-16 md:mb-28">
        <WorksWheel
          items={VIDEO_WORKS}
          label="WORKS"
          action="Inspect"
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-16 pt-8 sm:pt-12 border-t border-buttercream/10">
        <div className="mb-8 md:mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-whispy-light font-bold block mb-2 sm:mb-3">
            Selected Works
          </span>
          <h2 className="text-[clamp(1.5rem,6.2vw,3rem)] md:text-5xl font-black font-display text-buttercream uppercase tracking-tight">
            VISUAL & PHOTO EXHIBITION
          </h2>
        </div>

        <div className="w-full">
          <LiquidGlassCarousel items={PHOTO_WORKS} panelHeight={420} entry={false} background="#160E12" />
        </div>
      </div>
    </section>
  );
}

export default WorksSection;
