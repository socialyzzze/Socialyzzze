import React from 'react';
import { cn } from '@/lib/utils'; // Assuming a `cn` utility for classnames

// Define the type for individual logo props
export interface Logo {
  src: string;
  alt: string;
  gradient?: {
    from: string;
    via: string;
    to: string;
  };
}

// Define the props for the main component
export interface MarqueeLogoScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  logos: Logo[];
  speed?: 'normal' | 'slow' | 'fast';
}

/**
 * A responsive, self-contained, and infinitely scrolling marquee component.
 * It pauses on hover and uses shadcn/ui theme variables for styling.
 * This component includes its own CSS animation and does not require tailwind.config.js modifications.
 */
const MarqueeLogoScroller = React.forwardRef<HTMLDivElement, MarqueeLogoScrollerProps>(
  ({ title, description, logos, speed = 'normal', className, ...props }, ref) => {
    // Map speed prop to animation duration
    const durationMap = {
      normal: '60s',
      slow: '120s',
      fast: '5s',
    };
    const animationDuration = durationMap[speed];

    // Repeat the list so each half of the loop is wider than the screen (no gaps with few logos)
    const repeated = Array.from({ length: 3 }, () => logos).flat();

    return (
      <>
        {/* The @keyframes for the marquee animation are defined directly here for robustness. */}
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <section
          ref={ref}
          aria-label={title}
          className={cn(
            'w-full bg-[#0E090B] text-buttercream overflow-hidden',
            className
          )}
          {...props}
        >
          {/* Header Section */}
          <div className="p-6 md:p-8 lg:p-10 border-b border-buttercream/10">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 pb-6 md:pb-8 border-b border-buttercream/5">
              <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter text-balance text-buttercream">
                {title}
              </h2>
              <p className="text-buttercream/60 font-light self-start lg:justify-self-end text-balance">
                {description}
              </p>
            </div>
          </div>

          {/* Marquee Section */}
          <div
            className="w-full overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div
              className="flex w-max items-center gap-4 py-8 pr-4 hover:[animation-play-state:paused] transition-all duration-300 ease-in-out"
              style={{
                animation: `marquee ${animationDuration} linear infinite`,
              }}
            >
              {/* Render the repeated set twice to create a seamless loop */}
              {[...repeated, ...repeated].map((logo, index) => (
                <div
                  key={index}
                  className="group relative h-28 w-48 shrink-0 flex items-center justify-center rounded-lg bg-[#160E12] border border-buttercream/5 overflow-hidden"
                >
                  {/* Red gradient background revealed on hover (same for every card) */}
                  <div
                    className="absolute inset-0 scale-150 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100 bg-gradient-to-br from-[#8E1D2E] via-[#58111A] to-[#3A0A10]"
                  />
                  {/* Logo Image */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="relative h-3/4 w-auto object-contain rounded-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

MarqueeLogoScroller.displayName = 'MarqueeLogoScroller';

export { MarqueeLogoScroller };