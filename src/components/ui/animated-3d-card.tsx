"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Code,
  Palette,
  Users,
  Zap,
  Globe,
  Heart,
  Star,
  Database,
  Shield,   
} from "lucide-react";

const THEMES = {
  primary: "from-[#1C1217] via-[#160E12] to-[#0E090B]",
  secondary: "from-[#1C1217] via-[#160E12] to-[#0E090B]", 
  accent: "from-[#1C1217] via-[#160E12] to-[#0E090B]", 
  success: "from-[#1C1217] via-[#160E12] to-[#0E090B]",
  warning: "from-[#1C1217] via-[#160E12] to-[#0E090B]",
  danger: "from-[#1C1217] via-[#160E12] to-[#0E090B]",
  info: "from-[#1C1217] via-[#160E12] to-[#0E090B]",
  neutral: "from-[#1C1217] via-[#160E12] to-[#0E090B]",
} as const;

export type ThemeType = keyof typeof THEMES;

interface MousePos {
  readonly x: number;
  readonly y: number;
}

export interface Card3DProps {
  title: React.ReactNode;
  description: React.ReactNode;
  image?: string;
  icon?: React.ReactNode;
  theme?: ThemeType;
  gradient?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "premium";
  disabled?: boolean;
  loading?: boolean;
  phase?: string;
}

export interface CardData {
  id: string | number;
  title: React.ReactNode;
  description: React.ReactNode;
  image?: string;
  icon?: React.ReactNode;
  theme?: ThemeType;
  gradient?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  phase?: string;
}

export interface Card3DListProps {
  cards: CardData[];
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: "sm" | "md" | "lg" | "xl";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "premium";
  animated?: boolean;
  staggerDelay?: number;
}

const SIZES = {
  sm: "h-64",
  md: "h-80",
  lg: "h-96",
} as const;

const VARIANTS = {
  default: "shadow-lg hover:shadow-2xl border border-buttercream/10",
  minimal: "shadow-md hover:shadow-lg border border-buttercream/5",
  premium: "shadow-xl hover:shadow-2xl ring-1 ring-buttercream/15",
} as const;

const GRIDS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
} as const;

const GAPS = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-10",
} as const;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12, mass: 0.7 },
  },
};

export const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  (
    {
      title,
      description,
      image,
      icon,
      theme = "primary",
      gradient,
      onClick,
      className,
      size = "md",
      variant = "default",
      disabled = false,
      loading = false,
      phase,
      ...props
    },
    ref
  ) => {
    const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const finalGradient = useMemo(
      () => gradient || THEMES[theme],
      [gradient, theme]
    );
    const patternId = useMemo(
      () => `pattern-${theme}-${typeof title === "string" ? title.replace(/\s+/g, "-").toLowerCase() : Math.random().toString(36).substring(7)}`,
      [theme, title]
    );

    const handleMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({
          x: (x / rect.width - 0.5) * 25,
          y: (y / rect.height - 0.5) * -25,
        });
      },
      [disabled]
    );

    const handleEnter = useCallback(() => {
      if (disabled) return;
      setHovered(true);
    }, [disabled]);

    const handleLeave = useCallback(() => {
      if (disabled) return;
      setHovered(false);
      setMousePos({ x: 0, y: 0 });
    }, [disabled]);

    const handleClick = useCallback(() => {
      if (disabled || loading || !onClick) return;
      onClick();
    }, [disabled, loading, onClick]);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl transform-gpu transition-all duration-500 ease-out bg-[#160E12]",
          SIZES[size],
          VARIANTS[variant],
          onClick && !disabled && !loading && "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          loading && "pointer-events-none",
          className
        )}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        animate={{
          rotateX: disabled ? 0 : mousePos.y,
          rotateY: disabled ? 0 : mousePos.x,
          z: disabled ? 0 : hovered ? 30 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
        whileTap={
          disabled || !onClick
            ? {}
            : {
                scale: 0.98,
                rotateX: mousePos.y + 3,
                rotateY: mousePos.x + 3,
              }
        }
        onClick={handleClick}
        style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
        role={onClick ? "button" : "article"}
        tabIndex={onClick && !disabled ? 0 : -1}
        {...props}
      >
        <motion.div
          className={cn(
            "absolute inset-0 rounded-2xl",
            image ? "" : `bg-gradient-to-br ${finalGradient}`
          )}
          animate={{ scale: hovered ? 1.02 : 1 }}
          transition={{ duration: 0.4 }}
          style={{ transform: "translateZ(-10px)" }}
        >
          {image && (
            <img
              src={image}
              alt={typeof title === "string" ? title : "Card image"}
              className="h-full w-full object-cover transition-transform duration-500"
              loading="lazy"
            />
          )}
        </motion.div>

        <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
          <svg
            className="absolute -top-4 -right-4 w-32 h-32 text-buttercream"
            viewBox="0 0 100 100"
          >
            <defs>
              <pattern
                id={patternId}
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="1"
                  fill="currentColor"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#${patternId})`} />
          </svg>

          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 opacity-30 text-blood-accent"
            animate={{ rotate: hovered ? 180 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-current">
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                rx="8"
              />
              <rect
                x="35"
                y="35"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                rx="4"
              />
            </svg>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(200,16,46,0.05) 0%, rgba(200,16,46,0.15) 50%, rgba(200,16,46,0.05) 100%)`,
            transform: "translateZ(5px)",
          }}
          animate={{ opacity: hovered ? 0.8 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          style={{ transform: "translateZ(15px)" }}
        >
          <motion.div
            className="absolute -inset-full"
            animate={{
              background: hovered
                ? `linear-gradient(${mousePos.x + 135}deg, transparent 40%, rgba(244,232,215,0.1) 50%, transparent 60%)`
                : "transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        <motion.div
          className="relative z-20 flex h-full flex-col p-6 text-buttercream"
          style={{ transform: "translateZ(20px)" }}
        >
          {phase && (
             <motion.div
               className="text-blood-accent font-mono text-sm tracking-wider mb-8"
               animate={{ y: hovered ? -2 : 0 }}
               transition={{ duration: 0.3 }}
             >
               {phase}
             </motion.div>
          )}

          <div className="flex justify-between items-start mb-6">
            {icon && (
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="text-3xl opacity-90 filter drop-shadow-lg text-blood-accent"
                  animate={{
                    rotateZ: hovered ? 5 : 0,
                    y: hovered ? -2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {icon}
                </motion.div>
              </motion.div>
            )}
          </div>

          <motion.div
            className="space-y-4 flex-1"
            animate={{ y: hovered ? -3 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3
              className="text-base xl:text-lg font-black font-display tracking-tight uppercase"
              animate={{ scale: hovered ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>

            <motion.p
              className="text-sm text-buttercream/80 leading-relaxed font-normal"
              animate={{ opacity: hovered ? 1 : 0.85 }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
          </motion.div>
            
          <motion.div 
            className="mt-auto border-t border-buttercream/10 pt-4"
            animate={{ borderColor: hovered ? 'rgba(200,16,46,0.3)' : 'rgba(244,232,215,0.1)' }}
          >
             {onClick && !disabled && (
              <motion.div
                className="flex items-center space-x-2 text-blood-accent"
                animate={{
                  x: hovered ? 4 : 0,
                  opacity: hovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-0.5 w-4 bg-current rounded-full" />
                <div className="text-xs font-medium uppercase tracking-wider">
                  {loading ? "Loading..." : "Explore"}
                </div>
              </motion.div>
             )}
          </motion.div>
        </motion.div>

        {!disabled && (
          <motion.div
            className="absolute -inset-0.5 rounded-2xl opacity-0 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${finalGradient})`,
              filter: "blur(15px)",
              transform: "translateZ(-5px)",
            }}
            animate={{ opacity: hovered ? 0.4 : 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </motion.div>
    );
  }
);

Card3D.displayName = "Card3D";

export const Card3DList: React.FC<Card3DListProps> = ({
  cards,
  className,
  columns = 3,
  gap = "md",
  size = "md",
  variant = "default",
  animated = true,
  staggerDelay = 0.08,
}) => {
  const gridClass = useMemo(() => GRIDS[columns], [columns]);
  const gapClass = useMemo(() => GAPS[gap], [gap]);

  const customVariants = useMemo(
    () => ({
      ...containerVariants,
      visible: {
        ...containerVariants.visible,
        transition: {
          ...containerVariants.visible.transition,
          staggerChildren: staggerDelay,
        },
      },
    }),
    [staggerDelay]
  );

  const elements = useMemo(
    () =>
      cards.map((card, index) => (
        <motion.div
          key={card.id}
          variants={animated ? itemVariants : undefined}
          custom={index}
          whileInView={animated ? "visible" : undefined}
          initial={animated ? "hidden" : undefined}
          viewport={
            animated ? { once: true, margin: "-50px", amount: 0.2 } : undefined
          }
          style={{ transformStyle: "preserve-3d" }}
          className="h-full"
        >
          <Card3D
            title={card.title}
            description={card.description}
            image={card.image}
            icon={card.icon}
            theme={card.theme}
            gradient={card.gradient}
            onClick={card.onClick}
            size={size}
            variant={variant}
            disabled={card.disabled}
            loading={card.loading}
            phase={card.phase}
            className="h-full"
          />
        </motion.div>
      )),
    [cards, size, variant, animated]
  );

  return (
    <div className="relative">
      <motion.div
        className={cn("relative grid w-full", gridClass, gapClass, className)}
        variants={animated ? customVariants : undefined}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
      >
        {elements}
      </motion.div>
    </div>
  );
};
