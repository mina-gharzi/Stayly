// src/components/ui/Pagination.tsx
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const navBtn =
    'flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-card transition-all duration-200 hover:border-primary-300 hover:text-primary-700 disabled:pointer-events-none disabled:opacity-40'

  return (
    <nav
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
      aria-label="صفحه‌بندی"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="صفحه قبل"
          className={navBtn}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex items-center gap-1.5">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-all duration-200',
                p === page
                  ? 'bg-primary-600 text-white shadow-float'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-700',
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="صفحه بعد"
          className={navBtn}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <p className="text-xs text-neutral-500">
        صفحه <span className="font-semibold text-neutral-700">{page}</span> از{" "}
        <span className="font-semibold text-neutral-700">{totalPages}</span>
      </p>
    </nav>
  );
}