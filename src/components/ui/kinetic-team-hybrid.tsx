import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Minus, Plus } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  imagePosition?: string;
  link?: string;
  linkText?: string;
}

export interface TeamGroup {
  category?: string;
  members: TeamMember[];
}

export interface KineticTeamHybridProps {
  team?: TeamMember[];
  groups?: TeamGroup[];
}

export function KineticTeamHybrid({ team, groups }: KineticTeamHybridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedGroups: TeamGroup[] = groups || (team ? [{ members: team }] : []);
  const allMembers = resolvedGroups.flatMap((g) => g.members);
  const activeMember = allMembers.find((t) => t.id === activeId);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches;
      setIsMobile(window.innerWidth < 1024 || isTouch);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY - 280);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full cursor-default mt-12"
    >
      <div className="flex flex-col gap-14 md:gap-20">
        {resolvedGroups.map((group, groupIdx) => (
          <div key={group.category || groupIdx} className="flex flex-col">
            {group.category && (
              <div className="flex items-center gap-4 pb-4 mb-2">
                <div className="w-8 h-[1px] bg-blood-accent"></div>
                <span className="text-xs uppercase font-mono tracking-[0.3em] text-blood-accent font-bold">
                  {group.category}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              {group.members.map((member, index) => (
                <TeamRow
                  key={member.id}
                  data={member}
                  index={index}
                  isActive={activeId === member.id}
                  setActiveId={setActiveId}
                  isMobile={isMobile}
                  isAnyActive={activeId !== null}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        >
          <AnimatePresence mode="wait">
            {activeMember?.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative h-96 w-[28rem] overflow-hidden rounded-2xl border border-buttercream/15 bg-[#160E12] shadow-2xl"
              >
                <img
                  src={activeMember.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: activeMember.imagePosition || 'center' }}
                />

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blood-accent animate-pulse shadow-[0_0_8px_rgba(200,16,46,0.8)]" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-buttercream">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}: {
  data: TeamMember;
  index: number;
  isActive: boolean;
  setActiveId: (id: string | null) => void;
  isMobile: boolean;
  isAnyActive: boolean;
}) {
  const hasImage = !!data.image;
  const isDimmed = isAnyActive && !isActive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: isDimmed ? 0.3 : 1, y: 0 }}
      viewport={{ once: true }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        backgroundColor: isActive && isMobile ? "rgba(244,232,215,0.03)" : "transparent",
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && hasImage && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && hasImage && setActiveId(null)}
      onClick={() => isMobile && hasImage && setActiveId(isActive ? null : data.id)}
      className={`group relative border-t border-buttercream/10 transition-colors duration-500 last:border-b ${isMobile && hasImage ? "cursor-pointer" : "cursor-default"
        }`}
    >
      <div className="relative z-10 flex flex-col py-6 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex items-baseline gap-4 sm:gap-6 md:gap-12 pl-2 sm:pl-4 md:pl-0 transition-transform duration-500 group-hover:translate-x-4">
          <span className="font-mono text-xs text-blood-accent font-bold">
            {data.id || (index < 9 ? `0${index + 1}` : `${index + 1}`)}
          </span>
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-buttercream/60 transition-colors duration-300 group-hover:text-buttercream break-normal">
              {data.name}
            </h2>
            {data.link && (
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-1.5 inline-flex items-center gap-1 font-mono text-xs text-whispy-light/70 hover:text-buttercream underline underline-offset-4 tracking-wider transition-colors w-fit cursor-pointer z-20"
              >
                <span>{data.linkText || data.link}</span>
                <ArrowUpRight size={12} className="opacity-70" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pl-12 pr-4 md:mt-0 md:justify-end md:gap-12 md:pl-0 md:pr-0">
          <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-whispy-light transition-colors group-hover:text-blood-accent">
            {data.role}
          </span>

          {hasImage &&
            (isMobile ? (
              <div className="text-buttercream/50">
                {isActive ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            ) : (
              <motion.div
                animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
                className="text-blood-accent"
              >
                <ArrowUpRight size={28} strokeWidth={1.5} />
              </motion.div>
            ))}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && isActive && hasImage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-[#160E12]/50"
          >
            <div className="p-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <img
                  src={data.image}
                  alt={data.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: data.imagePosition || 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blood-accent animate-pulse shadow-[0_0_8px_rgba(200,16,46,0.8)]" />
                  <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-buttercream">
                    View Profile
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default KineticTeamHybrid;