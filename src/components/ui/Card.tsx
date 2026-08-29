// src/components/ui/Card.tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white shadow-card transition-shadow duration-300",
        className,
      )}
      {...props}
    />
  );
}
