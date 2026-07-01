import { HeroSection } from "@/components/sections/HeroSection";
import { BeerPreorderSection } from "@/components/sections/BeerPreorderSection";
import { StorySection } from "@/components/sections/StorySection";
import { BotanicheSection } from "@/components/sections/BotanicheSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { CocktailPreview } from "@/components/sections/CocktailPreview";
import { MundoClubSection } from "@/components/sections/MundoClubSection";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BeerPreorderSection />
      <StorySection />
      <BotanicheSection />
      <ProductShowcase />
      <section className="relative z-10 -my-[55px] h-[calc(100vh+110px)] w-full overflow-hidden bg-mundo-black">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        >
          <source src="/videos/svelo-og.mp4" type="video/mp4" />
        </video>
      </section>
      <CocktailPreview />
      <MundoClubSection />
    </>
  );
}
