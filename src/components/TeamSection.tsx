import React from "react";
import KineticTeamHybrid, { TeamGroup } from "@/components/ui/kinetic-team-hybrid";

export function TeamSection() {
  const groups: TeamGroup[] = [
    {
      category: "Founders Office",
      members: [
        {
          id: "01",
          name: "Mehak Raj",
          role: "Founder",
          image: "/team/mehak-raj.png",
        },
        {
          id: "02",
          name: "Kunal Raj",
          role: "Founders Office",
          image: "/team/kunal-raj.png",
          imagePosition: "top",
        },
      ],
    },
    {
      category: "Creative & Production",
      members: [
        {
          id: "03",
          name: "Mohit",
          role: "Videographer",
          image: "/team/mohit.jpg",
          link: "https://MohitDop.in",
        },
        {
          id: "04",
          name: "Ananya",
          role: "Content Strategist",
          image: "/team/ananya.png",
        },
        {
          id: "05",
          name: "Aman Rai",
          role: "Legal Team",
          image: "/team/aman-rai.png",
        },
        {
          id: "06",
          name: "Altamash",
          role: "Editor",
          image: "/team/altamash.png",
        },
      ],
    },
    {
      category: "Web Development Team",
      members: [
        {
          id: "07",
          name: "Aryan Boro",
          role: "Full Stack Developer",
          image: "/team/aryan-boro.jpg",
          imagePosition: "center",
        },
        {
          id: "08",
          name: "Kushagra Saxena",
          role: "Backend Developer",
          image: "/team/kushagra-saxena.png",
        },
      ],
    },
  ];

  return (
    <section id="team" className="py-20 sm:py-32 px-5 sm:px-6 md:px-16 bg-[#0E090B] border-b border-buttercream/10 text-buttercream">
      <div className="max-w-7xl mx-auto">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-whispy-light font-bold block mb-2">
                Multidisciplinary Talent
              </span>
              <h3 className="text-[clamp(1.5rem,6.5vw,2.25rem)] sm:text-4xl font-black font-display uppercase text-buttercream tracking-tight">
                THE PEOPLE BEHIND THE WORK
              </h3>
            </div>
            <p className="text-xs font-mono uppercase text-buttercream/60">
              Moving as one cohesive unit across creative & growth
            </p>
          </div>

          <div className="mt-8">
            <KineticTeamHybrid groups={groups} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
