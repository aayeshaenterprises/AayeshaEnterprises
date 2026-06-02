import { HeroSection } from "@/components/home/HeroSection";
import { StatsCounter } from "@/components/home/StatsCounter";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsCounter />
      <ServicesPreview />
      <FeaturedWork />
      <Testimonials />
      <CTASection />
    </div>
  );
}
