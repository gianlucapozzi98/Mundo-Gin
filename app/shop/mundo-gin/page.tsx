"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import {
  MUNDO_GIN_CARD_IMAGE,
  MUNDO_GIN_NAME,
  MUNDO_GIN_PRICE_DISPLAY,
  MUNDO_GIN_PRICE_EUR,
  MUNDO_GIN_PRODUCT_ID,
  MUNDO_GIN_SUBTITLE,
} from "@/lib/mundo-gin-product";

const PRODUCT_IMAGES = [
  "/images/bottiglia.png",
  "/images/bottiglia+pack.png",
];

const PRODUCT_SPECS: { label: string; value: string }[] = [
  { label: "Distillazione", value: "London dry" },
  { label: "Produzione", value: "Italia" },
  { label: "Colore", value: "Cristallino" },
  { label: "Gradazione", value: "40°" },
  { label: "Formato", value: "70cl" },
];

const FOOTER_GALLERY_MAIN = "/images/mundo-still8.png";
/** Riquadro che era la 7: ciclo 6 → 7 → 8 → 9 ogni secondo */
const FOOTER_ROTATING_IMAGES = [
  "/images/6.png",
  "/images/7.png",
  "/images/8.png",
  "/images/9.png",
] as const;

function RotatingFooterCell({ images }: { images: readonly string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 1000);
    return () => window.clearInterval(id);
  }, [images.length]);
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
      <img
        src={images[index]}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
  );
}

const ABBINAMENTI_ITEMS = [
  {
    title: "Acqua Brillante Recoaro",
    text: "tradizionalità italiana che offre una freschezza pulita, perfetta per valorizzare Mundo gin;",
  },
  {
    title: "Fever Tree Mediterranean, Indian e Refreshingly Light",
    text: "bilanciano perfettamente dolcezza e amaro, creando un matrimonio ideale di sapori, la Light offre un gusto ed un aroma pulito e rinfrescante;",
  },
  {
    title: "Dandy Tonic Water",
    text: "un'esperienza di gusto autentica e tradizionale.",
  },
];

export default function MundoGinProductPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [botanicheOpen, setBotanicheOpen] = useState(false);
  const [abbinamentiOpen, setAbbinamentiOpen] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const selectedImage = useMemo(
    () => PRODUCT_IMAGES[selectedIndex] ?? PRODUCT_IMAGES[0],
    [selectedIndex]
  );

  const handleAddToCart = () => {
    addToCart({
      productId: MUNDO_GIN_PRODUCT_ID,
      name: MUNDO_GIN_NAME,
      subtitle: MUNDO_GIN_SUBTITLE,
      priceEur: MUNDO_GIN_PRICE_EUR,
      qty,
      image: MUNDO_GIN_CARD_IMAGE,
    });
    setCartAdded(true);
    window.setTimeout(() => setCartAdded(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 pb-0 sm:pt-28 sm:pb-0">
      <div className="container mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          <section className="w-full shrink-0 lg:w-auto">
            <div className="mx-auto grid w-full max-w-[min(100%,676px)] grid-cols-1 items-start gap-6 lg:mx-0 lg:h-[448px] lg:max-w-none lg:grid-cols-[448px_212px] lg:items-stretch">
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

          <section className="w-full max-w-md shrink-0 text-center lg:max-w-sm">
            <h1 className="mb-2 text-mundo-black font-futura-500 font-medium text-4xl uppercase sm:text-5xl">
              MUNDO GIN
            </h1>
            <p className="mb-4 font-futura-400 text-[20px] tracking-wide text-mundo-black/75 sm:text-[22px]">
              Italian Coffee Dry Gin
            </p>
            <p className="mb-8 font-futura-500 text-[32px] leading-none text-mundo-black sm:text-[36px]">
              {MUNDO_GIN_PRICE_DISPLAY}
            </p>

            <div className="mb-2 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:items-end">
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
                onClick={handleAddToCart}
                className="h-[43px] rounded-lg bg-mundo-black px-7 font-futura-500 text-mundo-white transition-colors hover:bg-mundo-black/90"
              >
                {cartAdded ? "Aggiunto al carrello" : "Aggiungi al carrello"}
              </button>
            </div>
          </section>
        </div>

        <div className="mt-10 border-t border-b border-mundo-black/15 lg:mt-12">
          <div className="flex min-h-[140px] flex-col items-center justify-center py-8 lg:min-h-[168px] lg:py-10">
            <dl className="hidden min-w-0 items-center justify-center gap-x-7 px-2 text-[18px] lg:flex lg:flex-nowrap xl:gap-x-9 xl:text-[20px]">
              {PRODUCT_SPECS.map(({ label, value }) => (
                <div key={label} className="flex shrink-0 items-baseline gap-2">
                  <dt className="m-0 font-bold font-futura-500 text-mundo-black">
                    {label}
                  </dt>
                  <dd className="m-0 whitespace-nowrap font-futura-400 text-mundo-black/80">
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
              <ul className="m-0 flex list-none justify-center gap-x-10 p-0 text-center sm:gap-x-16">
                {PRODUCT_SPECS.slice(3).map(({ label, value }) => (
                  <li
                    key={label}
                    className="flex max-w-[42%] flex-col items-center gap-1.5 sm:max-w-none"
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

        <section className="mx-auto mt-0 max-w-4xl pt-10 text-left lg:pt-12">
          <div className="mb-10 lg:mb-12">
            <button
              type="button"
              className="lg:hidden flex w-full items-center justify-between gap-3 py-1 text-left"
              onClick={() => setBotanicheOpen((o) => !o)}
              aria-expanded={botanicheOpen}
              aria-controls="product-botaniche-panel"
            >
              <span className="text-mundo-black font-futura-500 font-medium text-2xl">
                Botaniche
              </span>
              <span
                className={`shrink-0 text-mundo-black/50 text-xl leading-none transition-transform duration-200 ${
                  botanicheOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            <h2 className="hidden lg:block text-mundo-black font-futura-500 font-medium text-2xl mb-4">
              Botaniche
            </h2>
            <div
              id="product-botaniche-panel"
              role="region"
              aria-label="Botaniche"
              className={`${botanicheOpen ? "block" : "hidden"} lg:block`}
            >
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed">
                Nel cuore del nostro gin, il caffè aggiunge una nota calda e
                delicata, integrandosi in modo armonioso con la freschezza del
                ginepro. Cardamomo e coriandolo aggiungono sfumature speziate e
                aromatiche; rosmarino, liquirizia e scorza d&apos;arancia
                completano il profilo, creando un equilibrio complesso, moderno e
                sorprendentemente armonico.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <button
              type="button"
              className="lg:hidden flex w-full items-center justify-between gap-3 py-1 text-left"
              onClick={() => setAbbinamentiOpen((o) => !o)}
              aria-expanded={abbinamentiOpen}
              aria-controls="product-abbinamenti-panel"
            >
              <span className="text-mundo-black font-futura-500 font-medium text-2xl">
                Abbinamenti consigliati
              </span>
              <span
                className={`shrink-0 text-mundo-black/50 text-xl leading-none transition-transform duration-200 ${
                  abbinamentiOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            <h2 className="hidden lg:block text-mundo-black font-futura-500 font-medium text-2xl mb-4">
              Abbinamenti consigliati
            </h2>
            <div
              id="product-abbinamenti-panel"
              role="region"
              aria-label="Abbinamenti consigliati"
              className={`${abbinamentiOpen ? "block" : "hidden"} lg:block`}
            >
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed mb-6">
                Il nostro gin è incredibilmente versatile: perfetto con le
                migliori toniche o come protagonista nei grandi classici della
                mixology, come il Negroni.
              </p>
              <ul className="list-none space-y-5 pl-0 m-0">
                {ABBINAMENTI_ITEMS.map((item) => (
                  <li
                    key={item.title}
                    className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed flex gap-3"
                  >
                    <span className="shrink-0 text-mundo-black/60" aria-hidden>
                      –
                    </span>
                    <span>
                      <span className="font-futura-500 text-mundo-black">
                        {item.title}
                      </span>
                      {": "}
                      {item.text}
                    </span>
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
                  src={FOOTER_GALLERY_MAIN}
                  alt="Mundo Gin"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:mx-0 lg:max-w-none lg:contents">
                <div className="grid grid-rows-2 gap-3 sm:gap-4 lg:h-full lg:min-h-0 lg:gap-6">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src="/images/3.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <RotatingFooterCell images={FOOTER_ROTATING_IMAGES} />
                </div>
                <div className="grid grid-rows-2 gap-3 sm:gap-4 lg:h-full lg:min-h-0 lg:gap-6">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src="/images/10.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white lg:aspect-auto lg:min-h-0">
                    <img
                      src="/images/11.png"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pt-[40px] pb-1 text-center sm:pt-[44px]">
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

