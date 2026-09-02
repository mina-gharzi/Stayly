/*!
 * Image Gallery Component for Stayly
 * -----------------------------------
 * A modern hotel image gallery with mobile and desktop views.
 *
 * Features:
 * - Responsive image grid
 * - Fullscreen modal preview
 * - Lazy loading
 * - Touch-friendly navigation
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { HotelImage } from "@/types";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const go = useCallback(
    (d: number) => {
      setIdx((i) =>
        d > 0
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
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [go, onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="نمایش تصویر"
      tabIndex={-1}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur focus:outline-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="بستن نمایش تصویر"
        className="absolute inset-s-4 top-4 h-10 w-10 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
      >
        <X aria-hidden />
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
            aria-label="تصویر بعدی"
            className="absolute inset-s-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/25"
          >
            <ChevronRight aria-hidden />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="تصویر قبلی"
            className="absolute inset-e-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/25"
          >
            <ChevronLeft aria-hidden />
          </button>
        </>
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs text-white backdrop-blur">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
}

export function ImageGallery({ images }: { images: HotelImage[] }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const prevIdx = useRef(0);

  useEffect(() => {
    const preload = [active - 1, active + 1, active + 2].filter(
      (i) => i >= 0 && i < images.length,
    );
    preload.forEach((i) => {
      const img = new Image();
      img.src = images[i].url;
    });
  }, [active, images.length]);

  useEffect(() => {
    const el = thumbsRef.current;
    if (!el) return;
    const btn = el.children[active] as HTMLElement;
    if (btn)
      btn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
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

  if (images.length === 0) return null;

  return (
    <div>
      <div className="sm:hidden">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100">
          <img
            src={images[active].url}
            alt={images[active].alt}
            className="h-full w-full object-contain"
          />
          <span className="absolute inset-e-3 top-3 rounded-full bg-neutral-900/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
            {active + 1}/{images.length}
          </span>
          <button
            onClick={() => setFullscreen(true)}
            aria-label="نمایش تمام‌صفحه تصویر"
            className="absolute inset-s-3 top-3 h-8 w-8 rounded-full bg-neutral-900/40 text-white backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="تصویر قبلی"
                className="absolute inset-s-2 top-1/2 h-8 w-8 rounded-full bg-white/80 text-neutral-800 shadow-soft"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="تصویر بعدی"
                className="absolute inset-e-2 top-1/2 h-8 w-8 rounded-full bg-white/80 text-neutral-800 shadow-soft"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                aria-label={`انتخاب تصویر ${i + 1}`}
                className={cn(
                  "rounded-full w-1.5 h-1.5",
                  i === active ? "bg-primary-600" : "bg-neutral-300",
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className="hidden sm:grid sm:h-105 lg:h-125 w-full grid-cols-[1fr_280px] gap-3">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={images[active].url}
            alt={images[active].alt}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/30" />
          <button
            onClick={() => setFullscreen(true)}
            aria-label="نمایش تمام‌صفحه تصویر"
            className="absolute inset-s-4 top-4 h-10 w-10 rounded-full bg-neutral-900/40 text-white backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <span className="absolute bottom-4 inset-s-1/2 -translate-x-1/2 text-xs font-medium bg-neutral-900/50 px-2 rounded text-white">
            {active + 1}/{images.length}
          </span>
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="تصویر قبلی"
                className="absolute inset-s-4 top-1/2 h-11 w-11 rounded-full bg-white/80 shadow-soft"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="تصویر بعدی"
                className="absolute inset-e-4 top-1/2 h-11 w-11 rounded-full bg-white/80 shadow-soft"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-none">
            {images.map((img, i) => (
              <button
                key={img.id || i}
                onClick={() => select(i)}
                aria-label={`انتخاب تصویر ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative rounded-xl",
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
                <span className="absolute bottom-1 inset-e-1 rounded bg-neutral-900/60 text-xs px-1 text-white">
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {fullscreen && (
        <FullscreenModal
          images={images}
          initial={active}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
