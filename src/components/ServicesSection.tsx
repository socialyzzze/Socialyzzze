import React from "react";
import { HTMLMotionProps, MotionConfig, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface TextStaggerHoverProps {
  text: string;
  index: number;
}
interface HoverSliderImageProps {
  index: number;
  imageUrl: string;
}
interface HoverSliderProps { }
interface HoverSliderContextValue {
  activeSlide: number;
  changeSlide: (index: number) => void;
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "));
  const characters = words.map((word) => word.split("")).flat(1);

  return {
    words,
    characters,
  };
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(undefined);

function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext);
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within a HoverSliderProvider");
  }
  return context;
}

export const HoverSlider = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & HoverSliderProps
>(({ children, className, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const changeSlide = React.useCallback(
    (index: number) => setActiveSlide(index),
    [setActiveSlide]
  );
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div className={className}>{children}</div>
    </HoverSliderContext.Provider>
  );
});
HoverSlider.displayName = "HoverSlider";

export const TextStaggerHover = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & TextStaggerHoverProps
>(({ text, index, children, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const isActive = activeSlide === index;
  const handleMouse = () => changeSlide(index);

  const words = text.split(" ");
  let globalCharIdx = 0;

  return (
    <span
      className={cn("relative inline-block origin-bottom cursor-pointer", className)}
      {...props}
      ref={ref}
      onMouseEnter={handleMouse}
      onClick={handleMouse}
    >
      {words.map((word, wordIdx) => (
        <span
          key={`${word}-${wordIdx}`}
          className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0"
        >
          {word.split("").map((char) => {
            const charIdx = globalCharIdx++;
            return (
              <span key={`${char}-${charIdx}`} className="relative inline-block overflow-hidden">
                <MotionConfig
                  transition={{
                    delay: charIdx * 0.02,
                    duration: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <motion.span
                    className="inline-block text-buttercream/40"
                    initial={{ y: "0%" }}
                    animate={isActive ? { y: "-110%" } : { y: "0%" }}
                  >
                    {char}
                  </motion.span>

                  <motion.span
                    className="absolute left-0 top-0 inline-block text-blood-accent font-black"
                    initial={{ y: "110%" }}
                    animate={isActive ? { y: "0%" } : { y: "110%" }}
                  >
                    {char}
                  </motion.span>
                </MotionConfig>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
});
TextStaggerHover.displayName = "TextStaggerHover";

export const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
  },
};

export const HoverSliderImageWrap = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
        className
      )}
      {...props}
    />
  );
});
HoverSliderImageWrap.displayName = "HoverSliderImageWrap";

export const HoverSliderImage = React.forwardRef<
  HTMLImageElement,
  HTMLMotionProps<"img"> & HoverSliderImageProps
>(({ index, imageUrl, children, className, ...props }, ref) => {
  const { activeSlide } = useHoverSliderContext();
  return (
    <motion.img
      src={imageUrl}
      className={cn("inline-block align-middle object-cover w-full h-full", className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={activeSlide === index ? "visible" : "hidden"}
      ref={ref}
      {...props}
    />
  );
});
HoverSliderImage.displayName = "HoverSliderImage";

function ServiceRow({
  service,
  index,
}: {
  service: { num: string; title: string; desc: string; image: string };
  index: number;
}) {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const isActive = activeSlide === index;

  return (
    <div
      className="py-5 sm:py-8 group cursor-pointer transition-colors"
      onClick={() => changeSlide(index)}
    >
      <div className="flex items-center gap-3 sm:gap-6 mb-2">
        <span
          className={cn(
            "font-mono text-xs font-bold border px-2 py-0.5 rounded shrink-0 transition-colors",
            isActive
              ? "text-blood-accent border-blood-accent bg-blood-accent/10"
              : "text-blood-accent/70 border-blood-accent/30"
          )}
        >
          {service.num}
        </span>
        <TextStaggerHover
          text={service.title}
          index={index}
          className="text-base sm:text-2xl md:text-4xl font-black font-display uppercase tracking-tight break-normal"
        />
      </div>
      <div className="pl-9 sm:pl-16 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-buttercream/65 max-w-lg leading-relaxed">
          {service.desc}
        </p>
        <a
          href="#contact"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blood-accent hover:text-buttercream transition-colors w-fit"
        >
          Inquire <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Mobile-only inline preview image that appears immediately when active/tapped */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:hidden pl-9 sm:pl-16 mt-4 overflow-hidden"
        >
          <div className="relative w-full h-[180px] sm:h-[220px] rounded-xl overflow-hidden border border-buttercream/15 shadow-xl bg-black/40">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E090B]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
              <span className="text-[9px] font-mono uppercase tracking-widest text-whispy-light font-bold bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-buttercream/10">
                Active Capability
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function ServicesSection() {
  const services = [
    {
      num: "01",
      title: "SOCIAL MEDIA STRATEGY",
      desc: "Channel roadmaps, content pillars and audience-first growth architecture.",
      deliverables: ["Channel Roadmaps", "Content Pillars", "Audience Insights"],
      image: "/social_media_strategy.jpg",
    },
    {
      num: "02",
      title: "CONTENT CREATION",
      desc: "Cinema-grade video reels, motion graphics and high-converting visual storytelling.",
      deliverables: ["Short-Form Reels", "Cinema Video", "3D Motion Design"],
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200",
    },
    {
      num: "03",
      title: "BRAND IDENTITY & VOICE",
      desc: "Distinctive positioning, visual systems and narrative tone for digital dominance.",
      deliverables: ["Brand Positioning", "Visual Guidelines", "Tone of Voice"],
      image: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=1200",
    },
    {
      num: "04",
      title: "PERFORMANCE MARKETING",
      desc: "Data-driven paid social campaigns and creative testing loops that compound ROI.",
      deliverables: ["Paid Social Ads", "A/B Testing Loops", "Funnel Optimization"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    },
    {
      num: "05",
      title: "DIGITAL EXPERIENCES",
      desc: "Ultra-fast websites, interactive microsites and custom web apps built to convert.",
      deliverables: ["Next.js / Vite Apps", "Interactive Storytelling", "High Conversion UX"],
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200",
    },
    {
      num: "06",
      title: "SOCIAL MEDIA",
      desc: "Strategy, content, reels, design, management & growth.",
      image: "/social_media_management.jpg",
    },
    {
      num: "07",
      title: "PERFORMANCE MARKETING",
      desc: "Data-driven campaigns designed to generate leads, sales & growth.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
    },
    {
      num: "08",
      title: "WEB DEVELOPMENT",
      desc: "Websites that look sharp, work seamlessly, and turn visitors into customers.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    },
    {
      num: "09",
      title: "CREATIVE & CONTENT",
      desc: "From concepts and scripts to shoots, editing and visual storytelling.",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200",
    },
    {
      num: "10",
      title: "INFLUENCER MARKETING",
      desc: "Strategic creator collaborations that put your brand in front of the right audience.",
      image: "/influencer_marketing.jpg",
    },
  ];

  return (
    <section id="services" className="py-20 sm:py-32 px-5 sm:px-6 md:px-16 bg-[#0E090B] border-b border-buttercream/10 text-buttercream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-20 gap-6 sm:gap-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-whispy-light font-bold block mb-2 sm:mb-3">
              Capabilities & Offerings
            </span>
            <h2 className="text-[clamp(1.85rem,7.5vw,3.75rem)] md:text-6xl font-black font-display text-buttercream uppercase tracking-tight">
              WHAT WE DO
            </h2>
          </div>
          <p className="text-buttercream/70 text-xs sm:text-base max-w-md font-normal leading-relaxed">
            <span className="md:hidden">Tap any capability</span>
            <span className="hidden md:inline">Hover over any capability</span>
            {" "}to explore our cinema-grade services, growth strategies, and digital experiences.
          </p>
        </div>

        <HoverSlider className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col divide-y divide-buttercream/10">
            {services.map((service, index) => (
              <ServiceRow key={service.num} service={service} index={index} />
            ))}
          </div>

          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 self-start relative w-full lg:h-[480px] rounded-3xl overflow-hidden border border-buttercream/15 shadow-2xl bg-black/40 mt-0">
            <HoverSliderImageWrap className="size-full">
              {services.map((service, index) => (
                <HoverSliderImage
                  key={service.num}
                  index={index}
                  imageUrl={service.image}
                  alt={service.title}
                />
              ))}
            </HoverSliderImageWrap>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E090B]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-whispy-light font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-buttercream/10">
                Preview
              </span>
            </div>
          </div>
        </HoverSlider>
      </div>
    </section>
  );
}

export default ServicesSection;