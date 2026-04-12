import { Metadata } from "next";
import Link from "next/link";
import { MUNDO_GIN_PRICE_DISPLAY } from "@/lib/mundo-gin-product";

export const metadata: Metadata = {
  title: "Shop | Mundo Gin",
  description: "Acquista Mundo Gin.",
};

export default function ShopPage() {
  return (
    <div className="pt-24 sm:pt-28 min-h-screen py-16 bg-[#F2F2F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="mb-10 text-center font-futura-500 font-medium uppercase tracking-[0.12em] text-mundo-black sm:mb-14 sm:tracking-[0.14em] text-[clamp(1.125rem,4.2vw,2.25rem)] leading-tight sm:leading-snug">
          Welcome to the Mundo&apos;s Webshop
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/shop/mundo-gin" className="group block">
            <article>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src="/images/bottiglia.png"
                  alt="Mundo Gin bottiglia"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                />
                <img
                  src="/images/bottiglia+pack.png"
                  alt="Mundo Gin bottiglia con pack"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-mundo-black font-futura-500 font-medium text-2xl uppercase">
                    Mundo Gin
                  </h2>
                  <p className="mt-1 text-mundo-black/70 font-futura-400 text-lg">
                    700 ml
                  </p>
                </div>
                <p className="text-right font-futura-500 font-medium text-2xl text-mundo-black">
                  {MUNDO_GIN_PRICE_DISPLAY}
                </p>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </div>
  );
}
