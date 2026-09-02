// src/components/ui/EmptyState.tsx
// کامپوننت استاندارد و یکدست برای حالت‌های خالی (Empty State) در سراسر پروژه.
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** آیا داخل یک کارت/کانتینر مرزبندی‌شده نمایش داده شود؟ (پیش‌فرض: true) */
  contained?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  contained = true,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 px-6 py-16 text-center",
        contained &&
          "rounded-2xl border border-dashed border-neutral-200 bg-white shadow-card",
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <Icon className="h-6 w-6 text-neutral-400" aria-hidden />
      </span>
      <div>
        <p className="font-semibold text-neutral-900">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
