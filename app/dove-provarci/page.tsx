import { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { LOCATIONS } from "./locations";
import { DynamicMapSection } from "./DynamicMapSection";

export const metadata: Metadata = {
  title: "Dove provarci | Mundo Gin",
  description:
    "Trova dove assaggiare Mundo Gin. Elenco dei bar e locali dove è disponibile Mundo.",
};

export default function DoveProvarciPage() {
  return (
    <div className="pt-24 sm:pt-28 bg-mundo-black">
      <PageHero
        title="Dove provarci"
        subtitle="Da queste location inizia il viaggio nel mondo di Mundo Gin: luoghi scelti per cocktail creativi, degustazioni curate e un'esperienza autentica."
      />

      {/* Mappa */}
      <section className="py-12 sm:py-16 bg-[#F2F2F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-mundo-black font-futura-500 font-medium text-xl mb-6">
            Vedi sulla mappa
          </h2>
          <div className="rounded-lg overflow-hidden border border-mundo-black/10 h-[280px]">
            <DynamicMapSection locations={LOCATIONS} compact />
          </div>
        </div>
      </section>

      {/* Elenco bar */}
      <section className="py-16 sm:py-20 lg:py-24 bg-mundo-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-mundo-black font-futura-500 font-medium text-2xl sm:text-3xl mb-10">
            Bar e locali con Mundo Gin
          </h2>

          {LOCATIONS.length === 0 ? (
            <p className="font-futura-400 text-mundo-black/80 text-lg">
              Presto online l’elenco aggiornato. Intanto scrivici per sapere
              dove trovarci.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-[35px] gap-y-6">
              {LOCATIONS.map((loc) => (
                <li key={loc.id} className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="text-mundo-black font-futura-500 font-medium text-xl mb-1">
                        {loc.name}
                      </h3>
                      <p className="font-futura-400 text-mundo-black/80 text-[19px]">
                        {loc.address}
                        <br />
                        {loc.city}
                        {loc.cap ? `, ${loc.cap}` : ""}
                        {loc.province ? ` (${loc.province})` : ""}
                      </p>
                      {loc.instagramUrl && (
                        <a
                          href={loc.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-mundo-black/80 hover:text-mundo-black transition-colors"
                          aria-label="Instagram"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                        </a>
                      )}
                    </div>
                    {loc.mapUrl && (
                      <a
                        href={loc.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-futura-500 font-medium text-mundo-black hover:underline text-sm uppercase tracking-wider shrink-0 mt-[-2px]"
                      >
                        Indicazioni
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 bg-mundo-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <p className="font-futura-400 text-mundo-black/90 text-[22px] leading-relaxed mb-6 max-w-xl mx-auto">
            Vuoi proporre Mundo Gin nel tuo locale? Contattaci per
            collaborazioni e distribuzione.
          </p>
          <Link
            href="/contatti"
            className="inline-block px-8 py-4 bg-mundo-black text-mundo-white font-futura-500 font-medium rounded-full hover:bg-mundo-black/90 transition-all"
          >
            Contattaci
          </Link>
        </div>
      </section>

      {/* Separatore prima del footer */}
      <section className="w-full">
        <img
          src="/images/bott bar.JPG"
          alt=""
          aria-hidden
          className="w-full h-auto object-cover object-[center_42%] max-h-[560px]"
        />
      </section>
    </div>
  );
}
