// src/components/common/FadeIn.tsx
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

const directionStyles: Record<Direction, string> = {
  up: "fade-in-up",
  down: "fade-in-down",
  left: "fade-in-left",
  right: "fade-in-right",
  none: "fade-in",
};

export function FadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 500,
  distance = 24,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.setProperty("--fade-delay", `${delay}ms`);
          el.style.setProperty("--fade-duration", `${duration}ms`);
          el.style.setProperty("--fade-distance", `${distance}px`);
          el.classList.add("is-visible");
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, distance, once]);

  return (
    <div
      ref={ref}
      className={cn("scroll-fade-in w-full", directionStyles[direction], className)}
    >
      {children}
    </div>
  );
}
