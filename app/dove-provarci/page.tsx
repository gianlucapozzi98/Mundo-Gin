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

const LOCATION_IMAGE_MAP: Record<string, string> = {
  Aguadecoco: "/images/Aguadecoco.webp",
  "Altrimenti Mixology Art": "/images/Altrimenti Mixology Art.webp",
  Anvil: "/images/Anvil.webp",
  Botero: "/images/Botero.webp",
  "BV Rooftop": "/images/bv.jpg",
  "Chiosco Mercedes": "/images/Chiosco Mercedes.webp",
  Dabass: "/images/Dabass.webp",
  "Dall'Antiquario": "/images/anticq.jpg",
  "Degustazione ristoro e dispensa": "/images/Degustazione ristoro dispen.webp",
  Eterno: "/images/Eterno.webp",
  "Il Nemico": "/images/Il Nemico.webp",
  "Let It Be": "/images/Let It Be.webp",
  "Madame del Borgo": "/images/MA.DA.ME..webp",
  "Mary's Pub": "/images/Mary's Pub.webp",
  "Moon Cafè": "/images/Moon Cafè.webp",
  Origin: "/images/Origin.webp",
  "Prosciutteria Jesolo": "/images/Prosciutteria.webp",
  Pulp: "/images/pulp.webp",
  "Fiaschetteria Quanto Basta": "/images/Quanto Basta.webp",
  "The First Caffè": "/images/The First Caffè.webp",
  "The Manhattan": "/images/The Manhattan.webp",
  "This Agio Cocktail Bar": "/images/This Agio.webp",
  Tipiko: "/images/Tipiko.webp",
  Tosti: "/images/Tosti.webp",
  Verdi: "/images/Verdi.webp",
  "Vinyl Pub": "/images/vinyl.jpg",
  "Violet Hill Cafè": "/images/Violet Hill Café.webp",
};

export default function DoveProvarciPage() {
  return (
    <div className="pt-24 sm:pt-28 bg-[#F2F2F2]">
      <PageHero
        title="Dove provarci"
        subtitle="Da queste location inizia il viaggio nel mondo di Mundo Gin: luoghi scelti per cocktail creativi, degustazioni curate e un'esperienza autentica."
      />

      {/* Mappa */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F2F2F2]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-futura-500 text-2xl font-medium tracking-tight text-mundo-black sm:text-3xl">
            Vedi sulla mappa
          </h2>
          <p className="mt-2 max-w-2xl font-futura-400 text-[17px] leading-relaxed text-mundo-black/65 sm:text-[18px]">
            Zoom, trascina e apri ogni punto: dettagli del locale, Instagram e
            link alle indicazioni.
          </p>
          <div className="mt-8">
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
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-[35px] gap-y-6">
              {LOCATIONS.map((loc) => (
                <li key={loc.id} className="py-4">
                  {(() => {
                    const imageSrc = LOCATION_IMAGE_MAP[loc.name];
                    return (
                      <>
                  {/* Mobile */}
                  <div className="sm:hidden">
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-mundo-black/10">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={loc.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <h3 className="text-mundo-black font-futura-500 font-medium text-lg mb-1">
                      {loc.name}
                    </h3>
                    <p className="font-futura-400 text-mundo-black/80 text-[18px]">
                      {loc.city}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {loc.instagramUrl && (
                        <a
                          href={loc.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-mundo-black/80 hover:text-mundo-black transition-colors"
                          aria-label="Instagram"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                        </a>
                      )}
                      {loc.mapUrl && (
                        <a
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-mundo-black/80 hover:text-mundo-black transition-colors"
                          aria-label="Indicazioni"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:flex sm:flex-row sm:items-start gap-3">
                    <div>
                      <div className="w-full max-w-[360px] aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-mundo-black/10">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={loc.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
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
                      <div className="flex items-center gap-3 mt-2">
                        {loc.instagramUrl && (
                          <a
                            href={loc.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-mundo-black/80 hover:text-mundo-black transition-colors"
                            aria-label="Instagram"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </a>
                        )}
                        {loc.mapUrl && (
                          <a
                            href={loc.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-mundo-black/80 hover:text-mundo-black transition-colors"
                            aria-label="Indicazioni"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 bg-mundo-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <p className="font-futura-400 text-mundo-black/90 text-[22px] leading-relaxed mb-6 max-w-xl lg:max-w-none lg:whitespace-nowrap mx-auto">
            Vuoi proporre Mundo Gin nel tuo locale? Contattaci per collaborazioni e distribuzione.
          </p>
          <Link
            href="/contatti"
            className="inline-block px-8 py-4 bg-mundo-black text-mundo-white font-futura-500 font-medium rounded-lg hover:bg-mundo-black/90 transition-all"
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
          className="w-[124vw] max-w-none -ml-[12vw] sm:w-full sm:max-w-full sm:ml-0 h-auto object-cover object-[center_42%] max-h-[560px]"
        />
      </section>
    </div>
  );
}
