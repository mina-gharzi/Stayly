// src/components/hotel/ImageGallery.tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { HotelImage } from "@/types";

/* ───────── مودال تمام‌صفحه ───────── */
function FullscreenModal({
  images,
  initial,
  onClose,
}: {
  images: HotelImage[];
  initial: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initial);

  const go = useCallback(
    (d: 1 | -1) => {
      setIdx((i) =>
        d === 1
          ? i === images.length - 1
            ? 0
            : i + 1
          : i === 0
            ? images.length - 1
            : i - 1,
      );
    },
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute inset-s-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative mx-4 max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[idx].url}
          alt={images[idx].alt}
          className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute inset-s-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute inset-e-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-mono text-sm text-white backdrop-blur">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

/* ───────── گالری اصلی ───────── */
export function ImageGallery({ images }: { images: HotelImage[] }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const prevIdx = useRef(0);

  if (images.length === 0) return null;

  /* پریلود عکس بعدی و قبلی */
  useEffect(() => {
    const preload = [active - 1, active + 1, active + 2].filter(
      (i) => i >= 0 && i < images.length,
    );
    preload.forEach((i) => {
      const img = new Image();
      img.src = images[i].url;
    });
  }, [active, images]);

  /* اسکرول خودکار thumbnails */
  useEffect(() => {
    const el = thumbsRef.current;
    if (!el) return;
    const activeBtn = el.children[active] as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

  function select(i: number) {
    prevIdx.current = active;
    setActive(i);
  }

  function prev() {
    select(active === 0 ? images.length - 1 : active - 1);
  }
  function next() {
    select(active === images.length - 1 ? 0 : active + 1);
  }

  return (
    <>
      {/* ═══════ موبایل — اسلایدر اصلی ═══════ */}
      <div className="sm:hidden">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100">
          <img
            src={images[active].url}
            alt={images[active].alt}
            className="h-full w-full object-contain transition-opacity duration-200"
          />

          {/* شمارنده */}
          <span className="absolute inset-e-3 top-3 rounded-full bg-neutral-900/50 px-2.5 py-1 font-mono text-xs text-white backdrop-blur-sm">
            {active + 1}/{images.length}
          </span>

          {/* تمام‌صفحه */}
          <button
            onClick={() => setFullscreen(true)}
            className="absolute inset-s-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/40 text-white backdrop-blur-sm transition hover:bg-neutral-900/60"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          {/* فلش‌ها */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute inset-s-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-sm backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="absolute inset-e-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-sm backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* نقاط */}
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === active
                    ? "h-1.5 w-5 bg-primary-600"
                    : "h-1.5 w-1.5 bg-neutral-300",
                )}
              />
            ))}
          </div>
        )}
      </div>
      {/* ═══════ دسکتاپ — گزینه C: بنتو گرید ═══════ */}
      <div className="hidden sm:grid sm:h-105 lg:h-125 w-full grid-cols-[1fr_280px] gap-3">
        {/* تصویر اصلی بزرگ */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={images[active].url}
            alt={images[active].alt}
            className="h-full w-full object-cover transition-all duration-500"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

          <button
            onClick={() => setFullscreen(true)}
            className="absolute inset-s-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/40 text-white backdrop-blur-sm transition hover:bg-neutral-900/60"
          >
            <Maximize2 className="h-5 w-5" />
          </button>

          <span className="absolute bottom-4 inset-s-1/2 -translate-x-1/2 rounded-full bg-neutral-900/50 px-3.5 py-1 font-mono text-sm font-medium text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute inset-s-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-lg backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                className="absolute inset-e-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-lg backdrop-blur-sm transition hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* گرید تصاویر کوچک */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => select(i)}
                className={cn(
                  "relative overflow-hidden rounded-xl transition-all duration-300",
                  i === active
                    ? "ring-2 ring-primary-600 ring-offset-2 ring-offset-white"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 inset-e-1 rounded bg-neutral-900/60 px-1.5 font-mono text-[10px] text-white">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══════ مودال تمام‌صفحه ═══════ */}
      {fullscreen && (
        <FullscreenModal
          images={images}
          initial={active}
          onClose={() => setFullscreen(false)}
        />
      )}
    </>
  );
}
