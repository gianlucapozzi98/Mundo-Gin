"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PRODUCT_IMAGES = [
  "/images/bottiglia.png",
  "/images/bottiglia+pack.png",
];

export default function MundoGinProductPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const selectedImage = useMemo(
    () => PRODUCT_IMAGES[selectedIndex] ?? PRODUCT_IMAGES[0],
    [selectedIndex]
  );

  return (
    <div className="pt-24 sm:pt-28 min-h-screen bg-[#F2F2F2] py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start lg:items-center">
          <section className="mt-[20px]">
            <div className="grid grid-cols-1 lg:grid-cols-[448px_212px] gap-6 items-start lg:h-[448px]">
              <div className="relative rounded-[32px] overflow-hidden bg-mundo-white border border-mundo-black/10 aspect-square lg:h-full lg:w-auto">
                <img
                  src={selectedImage}
                  alt="Mundo Gin"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 lg:h-full lg:grid-rows-2">
                {PRODUCT_IMAGES.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="rounded-2xl overflow-hidden border border-mundo-black/10 bg-mundo-white aspect-square lg:h-full lg:w-full"
                    aria-label={`Seleziona immagine ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      aria-hidden
                      className="w-full h-full object-contain p-3"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:self-center">
            <h1 className="text-mundo-black font-futura-500 font-medium text-4xl sm:text-5xl mb-2 uppercase">
              MUNDO GIN
            </h1>
            <p className="font-futura-400 text-mundo-black/70 text-[22px] mb-8">700 ml</p>

            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-2">
              <div className="inline-flex flex-col justify-end min-w-[180px] border-b border-mundo-black/70 pb-1">
                <div className="inline-flex items-center justify-between px-2">
                  <button
                    type="button"
                    className="w-9 text-center text-[34px] leading-none text-mundo-black disabled:opacity-35"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty === 1}
                    aria-label="Diminuisci quantità"
                  >
                    -
                  </button>
                  <span className="w-9 text-center font-futura-500 text-[40px] leading-none text-mundo-black">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="w-9 text-center text-[34px] leading-none text-mundo-black disabled:opacity-35"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Aumenta quantità"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="h-[43px] px-7 rounded-lg bg-mundo-black text-mundo-white font-futura-500 hover:bg-mundo-black/90 transition-colors"
              >
                Aggiungi al carrello
              </button>
            </div>
          </section>
        </div>

        <section className="mt-14 text-center">
          <div className="max-w-4xl mx-auto border-t border-mundo-black/15 pt-8">
            <h2 className="text-mundo-black font-futura-500 font-medium text-2xl mb-4">
              Temperatura e servizio
            </h2>
            <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed">
              Mundo Gin da il meglio di se servito freddo. Ideale in purezza,
              in Gin Tonic o nei grandi classici. Un profilo aromatico netto,
              contemporaneo e riconoscibile.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-block mt-10 text-mundo-black/70 hover:text-mundo-black font-futura-500 transition-colors"
          >
            ← Torna allo shop
          </Link>
        </section>
      </div>
    </div>
  );
}

