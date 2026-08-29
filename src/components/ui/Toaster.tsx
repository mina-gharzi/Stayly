// src/components/ui/Toaster.tsx
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/utils/cn'

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const colors = {
  success: 'border-success-500 text-success-500',
  error: 'border-error-500 text-error-500',
  info: 'border-primary-500 text-primary-700',
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 inset-e-4 z-50 flex flex-col gap-2" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-2 rounded-md border-s-4 bg-white px-4 py-3 shadow-elevated',
              colors[toast.type]
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <p className="text-sm text-neutral-800">{toast.message}</p>
            <button onClick={() => dismiss(toast.id)} aria-label="بستن اعلان" className="ms-2">
              <X className="h-4 w-4 text-neutral-400" aria-hidden />
            </button>
          </div>
        )
      })}
    </div>
  )
}