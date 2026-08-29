// src/components/ui/SectionDivider.tsx
import { Sparkles } from 'lucide-react'

export function SectionDivider() {
  return (
    <div className="flex items-center gap-5" aria-hidden>
      <span className="h-px flex-1 rounded-full bg-linear-to-l from-neutral-200 to-transparent" />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-500 shadow-card">
        <Sparkles className="h-4 w-4" />
      </div>
      <span className="h-px flex-1 rounded-full bg-linear-to-r from-neutral-200 to-transparent" />
    </div>
  )
}
