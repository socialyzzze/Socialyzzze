'use client';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'framer-motion';
import { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProjectData {
  title: string;
  description: string;
  link: string;
  color: string;
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const Card = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0'
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`flex flex-col relative -top-[25%] h-[520px] sm:h-[500px] w-[90%] sm:w-[85%] md:w-[70%] rounded-2xl p-5 sm:p-8 md:p-12 origin-top`}
      >
        <h2 className='text-2xl sm:text-3xl md:text-5xl font-black font-display text-buttercream uppercase tracking-tight mb-2'>{title}</h2>
        <div className={`flex flex-col md:flex-row h-full mt-2 gap-4 sm:gap-8 md:gap-12`}>
          <div className={`w-full md:w-[40%] relative md:top-[10%]`}>
            <p className='text-xs sm:text-base md:text-lg text-buttercream/80 font-light leading-relaxed'>{description}</p>
          </div>

          <div
            className={`relative w-full md:w-[60%] h-[150px] sm:h-[200px] md:h-full rounded-xl overflow-hidden shrink-0`}
          >
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}
            >
              <img src={url} alt={title} className='absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700' />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface StackingCardRootProps {
  projects: ProjectData[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

const StackingCard = forwardRef<HTMLElement, StackingCardRootProps>(({ projects, title, subtitle }, ref) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <ReactLenis root>
      <main className='bg-[#0E090B]' ref={container}>
        <section className='text-buttercream h-[60vh] w-full flex flex-col items-center justify-center relative overflow-hidden'>
          <div className='absolute inset-0 bg-[#0E090B] bg-[linear-gradient(to_right,#F4E8D71a_1px,transparent_1px),linear-gradient(to_bottom,#F4E8D71a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20'></div>

          <div className="z-10 text-center max-w-4xl px-6">
            {subtitle && (
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-whispy font-bold block mb-4">
                {subtitle}
              </span>
            )}
            {title && (
              <h1 className='text-4xl sm:text-6xl md:text-7xl font-black font-display uppercase tracking-tighter leading-[0.9] mb-6'>
                {title}
              </h1>
            )}
          </div>
        </section>

        <section className='text-buttercream w-full bg-[#0E090B] pb-24'>
          {projects.map((project, i) => {
            // Last card stays at full size; earlier cards step down 4% each (same look as the 5-card version)
            const targetScale = 1 - (projects.length - 1 - i) * 0.04;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={project.link}
                title={project.title}
                color={project.color}
                description={project.description}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </main>
    </ReactLenis>
  );
});

StackingCard.displayName = 'StackingCard';

export default StackingCard;