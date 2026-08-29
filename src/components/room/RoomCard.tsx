// src/components/room/RoomCard.tsx
import { Users, BedDouble, Maximize } from 'lucide-react'
import type { RoomType } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatToman } from '@/utils/currency'

export function RoomCard({ room, onSelect }: { room: RoomType; onSelect: (room: RoomType) => void }) {
  const isSoldOut = room.availableRooms === 0

  return (
    <Card className="flex flex-col overflow-hidden sm:flex-row">
      <div className="h-48 w-full shrink-0 sm:h-auto sm:w-56">
        <img src={room.images[0]} alt={room.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold text-neutral-900">{room.name}</h3>
          <p className="mt-1 text-sm text-neutral-600">{room.description}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-neutral-700">
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden />{room.maxGuests} مهمان</span>
          <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" aria-hidden />{room.bedType}</span>
          <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" aria-hidden />{room.size} متر مربع</span>
        </div>
        {isSoldOut && <Badge variant="error">ظرفیت تکمیل</Badge>}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <span className="text-xs text-neutral-600">هر شب </span>
            <span className="tabular-price text-lg font-semibold text-neutral-900">{formatToman(room.pricePerNight)}</span>
          </div>
          <Button size="sm" disabled={isSoldOut} onClick={() => onSelect(room)}>
            انتخاب اتاق
          </Button>
        </div>
      </div>
    </Card>
  )
}