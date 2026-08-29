// src/components/ui/GuestSelector.tsx
import { useEffect, useRef, useState } from 'react'
import { Users, Plus, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface GuestValue {
  adults: number
  children: number
  rooms: number
}

interface GuestSelectorProps {
  value: GuestValue
  onChange: (value: GuestValue) => void
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function update(key: keyof GuestValue, delta: number, min: number) {
    onChange({ ...value, [key]: Math.max(min, value[key] + delta) })
  }

  const rows: { key: keyof GuestValue; label: string; min: number }[] = [
    { key: 'adults', label: 'بزرگسال', min: 1 },
    { key: 'children', label: 'کودک', min: 0 },
    { key: 'rooms', label: 'اتاق', min: 1 },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm text-neutral-900"
      >
        <Users className="h-4 w-4 text-neutral-600" aria-hidden />
        {value.adults} بزرگسال، {value.children} کودک، {value.rooms} اتاق
      </button>
      {open && (
        <div className="absolute top-full z-10 mt-2 w-64 rounded-md border border-neutral-200 bg-white p-4 shadow-elevated">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-2">
              <span className="text-sm text-neutral-800">{row.label}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(row.key, -1, row.min)}
                  aria-label={`کاهش ${row.label}`}
                  disabled={value[row.key] <= row.min}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200',
                    value[row.key] <= row.min && 'opacity-40'
                  )}
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden />
                </button>
                <span className="w-4 text-center text-sm tabular-nums">{value[row.key]}</span>
                <button
                  type="button"
                  onClick={() => update(row.key, 1, row.min)}
                  aria-label={`افزایش ${row.label}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}