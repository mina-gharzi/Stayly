// src/pages/Home/index.tsx
import { Hero } from "@/components/home/Hero";
import { WhyStayly } from "@/components/home/WhyStayly";
import { PopularDestinations } from "@/components/home/PopularDestinations";
import { FeaturedHotels } from "@/components/home/FeaturedHotels";
import { PopularProperties } from "@/components/home/PopularProperties";
import { TestimonialStrip } from "@/components/home/TestimonialStrip";
import { CtaBanner } from "@/components/home/CtaBanner";

export function Home() {
  return (
    <div>
      <Hero />
      <PopularDestinations />
      <FeaturedHotels />
      <PopularProperties />
      <CtaBanner />
      <TestimonialStrip />
      <WhyStayly />
    </div>
  );
}
