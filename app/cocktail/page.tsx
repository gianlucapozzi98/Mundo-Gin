import { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";

export const metadata: Metadata = {
  title: "Cocktail | Mundo Gin",
  description: "Ricette e cocktail con Mundo Gin.",
};

const COCK_GALLERY = [
  "/images/cocktail-evento-mundo-gin.png",
  "/images/negroni-cocktail-evento-mundo-gin.jpg",
  "/images/cocktail-negroni-evento-mundo-gin.png",
  "/images/cock4.jpg",
  "/images/cock5.jpeg",
  "/images/cock6.jpg",
  "/images/cock7.jpeg",
];

export default function CocktailPage() {
  return (
    <div className="pt-24 sm:pt-28 bg-[#F2F2F2]">
      <PageHero
        title="Cocktail"
        subtitle="Cocktail pensati per esaltare ogni sfumatura di Mundo, tra equilibrio, carattere e creatività."
        subtitleSingleLineDesktop
      />

      <section className="py-16 sm:py-20 lg:py-32 bg-[#F2F2F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div className="aspect-[4/5] max-w-[420px] w-full rounded-lg overflow-hidden mx-auto self-start">
              <img
                src="/images/gin tonic.png?v=2"
                alt="Mundo Tonic"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="self-center max-w-[420px] w-full mx-auto">
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                Mundo Tonic
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed mb-4">
                Ingredienti:
              </p>
              <ul className="list-disc space-y-2 pl-6 font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
                <li>Mundo Gin - 50 ml</li>
                <li>Acqua tonica secca - 150 ml</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div className="order-2 lg:order-1 self-center max-w-[420px] w-full mx-auto">
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                Mundo Negroni
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed mb-4">
                Ingredienti:
              </p>
              <ul className="list-disc space-y-2 pl-6 font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
                <li>Mundo Gin - 30 ml</li>
                <li>Bitter - 30 ml</li>
                <li>Vermouth rosso - 30 ml</li>
                <li>Garnish - Scorza d&apos;arancia</li>
              </ul>
            </div>
            <div className="aspect-[4/5] max-w-[420px] w-full order-1 lg:order-2 rounded-lg overflow-hidden mx-auto self-start">
              <img
                src="/images/Negroni.jpeg"
                alt="Mundo Negroni"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
            <div className="aspect-[4/5] max-w-[420px] w-full rounded-lg overflow-hidden mx-auto self-start">
              <img
                src="/images/espr%20m.jpeg"
                alt="Espresso Mundo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="self-center max-w-[420px] w-full mx-auto">
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                Espresso Mundo
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed mb-4">
                Ingredienti:
              </p>
              <ul className="list-disc space-y-2 pl-6 font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
                <li>Mundo Gin - 50 ml</li>
                <li>Liquore al caffe - 30 ml</li>
                <li>Sciroppo di zucchero - 10 ml</li>
                <li>Caffe espresso</li>
                <li>Garnish - 3 chicchi di caffe</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="order-2 lg:order-1 self-center max-w-[420px] w-full mx-auto">
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                Dormo Domani by{" "}
                <a
                  href="https://www.eternomilano.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors hover:text-mundo-black/70"
                >
                  Eterno Milano
                </a>
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed mb-4">
                Ingredienti:
              </p>
              <ul className="list-disc space-y-2 pl-6 font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
                <li>Mundo Gin</li>
                <li>Vermouth</li>
                <li>Campari</li>
              </ul>
            </div>
            <div className="aspect-[4/5] max-w-[420px] w-full order-1 lg:order-2 rounded-lg overflow-hidden mx-auto self-start">
              <img
                src="/images/dormo.domani.drink.by.eterno.milano.jpg"
                alt="Dormo Domani by Eterno Milano"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F2F2F2] pb-16 sm:pb-20 lg:pb-24">
        {/* Mobile: slider manuale */}
        <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory lg:hidden">
          <div className="flex gap-4 px-4 min-w-max">
            {COCK_GALLERY.map((src, index) => (
              <div
                key={`mobile-${src}`}
                className="snap-start shrink-0 w-[280px] aspect-[4/5] rounded-lg overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Cocktail gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: slider automatico infinito */}
        <div className="hidden lg:block w-full overflow-hidden">
          <div className="cock-marquee-track">
            {[...COCK_GALLERY, ...COCK_GALLERY].map((src, index) => (
              <div
                key={`desktop-${src}-${index}`}
                className="shrink-0 w-[420px] aspect-[4/5] rounded-lg overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Cocktail gallery ${(index % COCK_GALLERY.length) + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
