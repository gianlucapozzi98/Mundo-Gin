import { Metadata } from "next";
import Link from "next/link";
import { MUNDO_GIN_PRICE_DISPLAY } from "@/lib/mundo-gin-product";

export const metadata: Metadata = {
  title: "Shop | Mundo Gin",
  description: "Acquista Mundo Gin.",
};

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F2F2F2] pt-24 sm:pt-28">
      <div className="container mx-auto max-w-7xl shrink-0 px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <h1 className="mb-10 text-center font-futura-500 font-medium uppercase tracking-[0.12em] text-mundo-black sm:mb-14 sm:tracking-[0.14em] text-[clamp(1.125rem,4.2vw,2.25rem)] leading-tight sm:leading-snug">
          Welcome to the Mundo&apos;s Webshop
        </h1>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/shop/mundo-gin" className="group block">
            <article>
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <img
                  src="/images/bottiglia.png"
                  alt="Mundo Gin bottiglia"
                  className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-500 group-hover:opacity-0"
                />
                <img
                  src="/images/bottiglia+pack.png"
                  alt="Mundo Gin bottiglia con pack"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="font-futura-500 text-2xl font-medium uppercase text-mundo-black">
                    Mundo Gin
                  </h2>
                  <p className="mt-1 font-futura-400 text-lg text-mundo-black/70">
                    700 ml
                  </p>
                </div>
                <p className="text-right font-futura-500 text-2xl font-medium text-mundo-black">
                  {MUNDO_GIN_PRICE_DISPLAY}
                </p>
              </div>
            </article>
          </Link>
        </div>
      </div>

      {/* Spazio uguale sopra/sotto l’immagine fino al footer: flex-1 + justify-center */}
      <section
        className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        aria-hidden
      >
        <img
          src="/images/aereo%20con%20scritta%20dietro%20n.png"
          alt=""
          className="h-auto w-full max-w-[38.4rem] object-contain"
        />
      </section>
    </div>
  );
}
