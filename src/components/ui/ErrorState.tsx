// src/components/ui/ErrorState.tsx
// کامپوننت استاندارد و یکدست برای حالت‌های خطا (Error State) در سراسر پروژه.
import { AlertTriangle } from "lucide-react";
import type { ReactNode, ComponentType } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ComponentType<{ className?: string }>;
  /** اگر داده‌ای که نمایش می‌دهیم پیدا نشد، به‌جای Retry یک اکشن جایگزین (مثلاً بازگشت) نمایش بده */
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "مشکلی پیش آمد",
  description,
  onRetry,
  retryLabel = "تلاش مجدد",
  icon: Icon = AlertTriangle,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center shadow-card",
        className,
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error-100">
        <Icon className="h-6 w-6 text-error-500" aria-hidden />
      </span>
      <div>
        <p className="font-semibold text-neutral-900">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
        )}
      </div>
      {action ?? (
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        )
      )}
    </div>
  );
}
