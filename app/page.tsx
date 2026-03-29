import { HeroSection } from "@/components/sections/HeroSection";
import { StorySection } from "@/components/sections/StorySection";
import { BotanicheSection } from "@/components/sections/BotanicheSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { CocktailPreview } from "@/components/sections/CocktailPreview";
import { MundoClubSection } from "@/components/sections/MundoClubSection";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <BotanicheSection />
      <ProductShowcase />
      <section className="relative z-10 -my-[30px] h-[calc(100vh+60px)] w-full overflow-hidden bg-mundo-black">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/svelo-og.mp4" type="video/mp4" />
        </video>
      </section>
      <CocktailPreview />
      <MundoClubSection />
    </>
  );
}
