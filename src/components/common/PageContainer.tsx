// src/components/common/PageContainer.tsx
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface PageContainerProps {
  /**
   * Tailwind max-width utility class, e.g. "max-w-3xl" or "max-w-5xl".
   * Keeping this as the only variable point (and px-4 sm:px-6 fixed)
   * guarantees every section's left/right edges line up on every
   * breakpoint, since they all share the exact same padding source.
   */
  maxWidth?: string;
  className?: string;
  children: ReactNode;
}

export function PageContainer({
  maxWidth = "max-w-5xl",
  className = "",
  children,
}: PageContainerProps) {
  return (
    <div className={cn("mx-auto px-4 sm:px-6", maxWidth, className)}>
      {children}
    </div>
  );
}