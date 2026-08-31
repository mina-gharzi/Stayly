// src/components/home/Hero.tsx
import heroImage from "@/assets/hero.webp";
import { SearchBox } from "./SearchBox";
import { FadeIn } from "@/components/common/FadeIn";

export function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10">
        <img src={heroImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-neutral-900/50" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-24 text-center text-white sm:py-28">
        <FadeIn>
          <div>
            <h1 className="text-2xl font-bold leading-snug sm:text-4xl">
              بهترین اقامت، نزدیکترین انتخاب
            </h1>
            <p className="mt-2 hidden text-white/80 sm:block">
              هتل و اقامتگاههای منتخب در ۵ مقصد محبوب
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <SearchBox />
        </FadeIn>
      </div>
    </section>
  );
}
