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

  return (
    <nav
      className="flex max-w-full flex-wrap items-center justify-center gap-2"
      aria-label="صفحه‌بندی"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="صفحه قبل"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-md text-sm tabular-nums',
            p === page ? 'bg-primary-700 text-white' : 'text-neutral-700 hover:bg-neutral-100'
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="صفحه بعد"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  )
}