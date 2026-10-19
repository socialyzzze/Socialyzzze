import React from "react";
import StackingCard, { ProjectData } from "@/components/ui/stacking-card";

export function ProcessSection() {
  const projects: ProjectData[] = [
    {
      title: "01 — Strategy First",
      description:
        "Every piece of content has a purpose. We start with your goals, your audience, and the platforms that matter, so nothing we make is random or posted just to fill a calendar.",
      link: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
      color: "#1C1217",
    },
    {
      title: "02 — Built to Stand Out",
      description:
        "We create content people actually want to watch. Sharp concepts, film-grade production, and scroll-stopping hooks that make your brand impossible to ignore in the feed.",
      link: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
      color: "#3A0A10",
    },
    {
      title: "03 — Data + Creativity",
      description:
        "Creative ideas backed by performance insights. We track what works, learn from every post, and keep refining so each campaign performs better than the last.",
      link: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      color: "#58111A",
    },
    {
      title: "04 — End-to-End Execution",
      description:
        "From the first idea to the final result, we handle it. Strategy, shooting, editing, design, publishing, and reporting all happen under one roof, with no handoffs and no gaps.",
      link: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop",
      color: "#8E1D2E",
    },
  ];

  return (
    <div id="process">
      <StackingCard
        title={
          <>
            OUR <br /> <span className="text-whispy">PROCESS</span>
          </>
        }
        subtitle="Our Approach"
        projects={projects}
      />
    </div>
  );
}

export default ProcessSection;