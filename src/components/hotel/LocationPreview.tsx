// src/components/hotel/LocationPreview.tsx
export function LocationPreview({ latitude, longitude, address }: { latitude: number; longitude: number; address: string }) {
  const delta = 0.01
  const bbox = `${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${latitude}%2C${longitude}`

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      <iframe
        title="موقعیت مکانی هتل"
        src={src}
        className="ltr-content h-64 w-full"
        loading="lazy"
      />
      <p className="p-3 text-sm text-neutral-600">{address}</p>
    </div>
  )
}