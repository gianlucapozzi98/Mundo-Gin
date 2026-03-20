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
      <CocktailPreview />
      <MundoClubSection />
    </>
  );
}
