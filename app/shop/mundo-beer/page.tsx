"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import {
  MUNDO_BEER_IMAGE,
  MUNDO_BEER_IMAGE_BACK,
  MUNDO_BEER_LATTINE_IMAGE,
  MUNDO_BEER_NAME,
  MUNDO_BEER_PRODUCT_IMAGES,
  MUNDO_BEER_VARIANTS,
} from "@/lib/mundo-beer-product";

const GALLERY_SLOTS = [...MUNDO_BEER_PRODUCT_IMAGES];

const PRODUCT_SPECS: { label: string; value: string }[] = [
  { label: "Formato", value: "0,33 cl" },
  { label: "Stile", value: "Pilsner" },
  { label: "Gradazione", value: "5%" },
  { label: "Colore", value: "Biondo dorato" },
  { label: "Gusto", value: "Erbaceo con delicate note maltate" },
];

const CONSIGLI_AVVERTENZE = [
  "Prodotta in uno stabilimento in cui si utilizzano frumento, avena e segale.",
  "Mantenere in un luogo fresco e al riparo dalla luce.",
  "Birra non pastorizzata e non filtrata senza aggiunta di conservanti.",
];

export default function MundoBeerProductPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);
  const [consigliOpen, setConsigliOpen] = useState(false);

  const selectedVariant = MUNDO_BEER_VARIANTS[variantIndex] ?? MUNDO_BEER_VARIANTS[0];

  const selectedImage = useMemo(
    () => GALLERY_SLOTS[selectedIndex] ?? MUNDO_BEER_IMAGE,
    [selectedIndex]
  );

  const handleAddToCart = () => {
    addToCart({
      productId: selectedVariant.id,
      name: MUNDO_BEER_NAME,
      subtitle: selectedVariant.label,
      priceEur: selectedVariant.priceEur,
      qty,
      image: MUNDO_BEER_IMAGE,
    });
    setCartAdded(true);
    window.setTimeout(() => setCartAdded(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 pb-0 sm:pt-28 sm:pb-0">
      <div className="container mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/shop"
            className="inline-block font-futura-500 text-mundo-black/70 transition-colors hover:text-mundo-black"
          >
            ← Torna allo shop
          </Link>
        </div>
        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          <section className="w-full shrink-0 lg:w-auto">
            <div className="mx-auto grid w-full max-w-[min(100%,676px)] grid-cols-1 items-start gap-6 lg:mx-0 lg:h-[448px] lg:max-w-none lg:grid-cols-[448px_212px] lg:items-stretch">
              <div className="relative aspect-square overflow-hidden rounded-[32px] border border-mundo-black/10 bg-mundo-white lg:h-full lg:w-auto">
                <img
                  src={selectedImage}
                  alt="Mundo Beer"
                  className="h-full w-full object-contain p-6 sm:p-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 lg:h-full lg:grid-cols-1 lg:grid-rows-2">
                {GALLERY_SLOTS.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:h-full lg:w-full"
                    aria-label={`Seleziona immagine ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-contain p-3"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full max-w-md shrink-0 text-center lg:max-w-sm">
            <h1 className="mb-2 font-futura-500 text-4xl font-medium uppercase text-mundo-black sm:text-5xl">
              {MUNDO_BEER_NAME}
            </h1>
            <p className="mb-6 font-futura-400 text-[20px] tracking-wide text-mundo-black/75 sm:text-[22px]">
              Pilsner - Alc. 5%
            </p>

            <div className="mb-6 flex flex-col gap-2">
              {MUNDO_BEER_VARIANTS.map((variant, index) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setVariantIndex(index)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                    variantIndex === index
                      ? "border-mundo-black bg-mundo-black text-mundo-white"
                      : "border-mundo-black/20 bg-mundo-white text-mundo-black hover:border-mundo-black/50"
                  }`}
                >
                  <span className="font-futura-500 text-lg">{variant.label}</span>
                  <span className="font-futura-500 text-lg tabular-nums">
                    {variant.priceDisplay}
                  </span>
                </button>
              ))}
            </div>

            <p className="mb-8 font-futura-500 text-[32px] leading-none text-mundo-black sm:text-[36px]">
              {selectedVariant.priceDisplay}
            </p>

            <div className="mb-2 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-center">
              <div className="inline-flex min-w-[180px] flex-col justify-end border-b border-mundo-black/70 pb-1">
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
                onClick={handleAddToCart}
                className={`h-[43px] rounded-lg border px-7 font-futura-500 transition-transform transition-colors ${
                  cartAdded
                    ? "scale-[1.03] border-mundo-black bg-transparent text-mundo-black"
                    : "border-mundo-black bg-mundo-black text-mundo-white hover:bg-transparent hover:text-mundo-black"
                }`}
              >
                {cartAdded ? "Aggiunto al carrello" : "Aggiungi al carrello"}
              </button>
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-b border-mundo-black/15 lg:mt-12">
          <div className="flex min-h-[140px] flex-col items-center justify-center py-8 lg:min-h-[168px] lg:py-10">
            <dl className="hidden min-w-0 flex-wrap items-center justify-center gap-x-7 gap-y-4 px-2 text-[18px] lg:flex xl:gap-x-9 xl:text-[20px]">
              {PRODUCT_SPECS.map(({ label, value }) => (
                <div key={label} className="flex shrink-0 items-baseline gap-2">
                  <dt className="m-0 font-bold font-futura-500 text-mundo-black">
                    {label}
                  </dt>
                  <dd className="m-0 max-w-[16rem] font-futura-400 text-mundo-black/80">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div
              className="flex w-full flex-col items-center gap-y-10 px-4 text-[15px] sm:text-[17px] lg:hidden"
              aria-label="Specifiche prodotto"
            >
              <ul className="m-0 grid w-full max-w-lg list-none grid-cols-3 gap-x-2 gap-y-0 p-0 text-center sm:gap-x-4">
                {PRODUCT_SPECS.slice(0, 3).map(({ label, value }) => (
                  <li key={label} className="flex flex-col items-center gap-1.5">
                    <span className="font-bold font-futura-500 leading-tight text-mundo-black">
                      {label}
                    </span>
                    <span className="font-futura-400 leading-snug text-mundo-black/80">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="m-0 flex list-none justify-center gap-x-6 p-0 text-center sm:gap-x-10">
                {PRODUCT_SPECS.slice(3).map(({ label, value }) => (
                  <li
                    key={label}
                    className="flex max-w-[46%] flex-col items-center gap-1.5 sm:max-w-none"
                  >
                    <span className="font-bold font-futura-500 leading-tight text-mundo-black">
                      {label}
                    </span>
                    <span className="font-futura-400 leading-snug text-mundo-black/80">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-10 max-w-3xl space-y-4 pt-4 text-center lg:mt-12 lg:max-w-none lg:pt-6">
          <p className="font-futura-400 text-[20px] leading-relaxed text-mundo-black/80 sm:text-[22px]">
            Mundo Beer è finalmente disponibile.
          </p>
          <p className="font-futura-400 text-[20px] leading-relaxed text-mundo-black/80 sm:text-[22px]">
            Leggera, rinfrescante e facile da bere, nasce per condividere
            momenti, persone ed esperienze.
          </p>
          <p className="font-futura-400 text-[20px] leading-relaxed text-mundo-black/80 sm:text-[22px]">
            Scegli il pack che preferisci e scopri il nuovo modo di vivere Mundo.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-4xl text-left lg:mt-12">
          <div className="mb-10 lg:mb-12">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 py-1 text-left lg:hidden"
              onClick={() => setConsigliOpen((o) => !o)}
              aria-expanded={consigliOpen}
              aria-controls="product-consigli-panel"
            >
              <span className="font-futura-500 text-2xl font-medium text-mundo-black">
                Consigli e avvertenze
              </span>
              <span
                className={`shrink-0 text-xl leading-none text-mundo-black/50 transition-transform duration-200 ${
                  consigliOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            <h2 className="mb-4 hidden font-futura-500 text-2xl font-medium text-mundo-black lg:block">
              Consigli e avvertenze
            </h2>
            <div
              id="product-consigli-panel"
              role="region"
              aria-label="Consigli e avvertenze"
              className={`${consigliOpen ? "block" : "hidden"} lg:block`}
            >
              <ul className="m-0 list-none space-y-4 p-0">
                {CONSIGLI_AVVERTENZE.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-futura-400 text-[20px] leading-relaxed text-mundo-black/80 sm:text-[22px]"
                  >
                    <span className="shrink-0 text-mundo-black/60" aria-hidden>
                      –
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="mt-16 flex flex-col pb-8 sm:pb-10 lg:mt-24"
          aria-label="Galleria fotografica"
        >
          <div className="flex w-full justify-center">
            <div className="grid w-full max-w-[min(100%,515px)] grid-cols-1 gap-6 lg:mx-auto lg:h-[515px] lg:w-auto lg:max-w-none lg:grid-cols-[515px_244px_244px] lg:items-stretch">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[32px] border border-mundo-black/10 bg-mundo-white lg:mx-0 lg:h-full lg:min-h-0">
                <img
                  src={MUNDO_BEER_IMAGE}
                  alt="Mundo Beer"
                  className="h-full w-full object-contain p-8"
                />
              </div>

              <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:mx-0 lg:max-w-none lg:contents">
                <div className="grid grid-rows-2 gap-3 sm:gap-4 lg:h-full lg:min-h-0 lg:gap-6">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src={MUNDO_BEER_IMAGE_BACK}
                      alt=""
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src={MUNDO_BEER_IMAGE}
                      alt=""
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                </div>
                <div className="grid grid-rows-2 gap-3 sm:gap-4 lg:h-full lg:min-h-0 lg:gap-6">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src={MUNDO_BEER_IMAGE_BACK}
                      alt=""
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src={MUNDO_BEER_LATTINE_IMAGE}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pb-1 pt-[40px] text-center sm:pt-[44px]">
            <Link
              href="/shop"
              className="inline-block font-futura-500 text-mundo-black/70 transition-colors hover:text-mundo-black"
            >
              ← Torna allo shop
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
