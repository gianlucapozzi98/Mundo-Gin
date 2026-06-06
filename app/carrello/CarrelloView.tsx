"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatEur,
  getCart,
  removeFromCart,
  updateCartQuantity,
  addToCart,
  type CartLine,
} from "@/lib/cart";
import { trackViewCart } from "@/lib/meta-pixel";

export function CarrelloView() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setLines(getCart());
    sync();
    trackViewCart(getCart());
    window.addEventListener("mundo-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mundo-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleChangeQty = (productId: string, delta: number) => {
    setLines((prev) => {
      const next = prev.map((line) =>
        line.productId === productId
          ? { ...line, qty: Math.max(1, line.qty + delta) }
          : line
      );
      const current = next.find((l) => l.productId === productId);
      if (current) {
        updateCartQuantity(productId, current.qty);
      }
      return next;
    });
  };

  const total = lines.reduce((sum, l) => sum + l.priceEur * l.qty, 0);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            qty: l.qty,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setCheckoutError(data.error ?? "Impossibile avviare il pagamento.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError("Risposta dal server non valida.");
    } catch {
      setCheckoutError("Connessione non riuscita. Riprova.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (lines.length === 0) {
    return (
      <>
        <p className="font-futura-400 text-[22px] text-mundo-black/70">
          Il tuo carrello è vuoto.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-lg bg-mundo-black px-7 py-3 font-futura-500 font-medium text-mundo-white transition-all hover:bg-mundo-black/90"
        >
          Torna allo Shop
        </Link>
      </>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="m-0 list-none space-y-6 p-0">
        {lines.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col gap-4 border-b border-mundo-black/10 pb-6 sm:flex-row sm:items-center"
          >
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-mundo-black/10 bg-mundo-white sm:h-32 sm:w-32">
              <img
                src={line.image}
                alt=""
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1">
              {line.productId === "mundo-gin" ? (
                <Link
                  href="/shop/mundo-gin"
                  className="inline-block font-futura-500 text-lg uppercase text-mundo-black underline-offset-4 hover:underline"
                >
                  {line.name}
                </Link>
              ) : (
                <p className="font-futura-500 text-lg uppercase text-mundo-black">
                  {line.name}
                </p>
              )}
              {line.subtitle ? (
                <p className="mt-1 font-futura-400 text-mundo-black/70">
                  {line.subtitle}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-mundo-black/80">
                <span className="font-futura-400">
                  Qtà{" "}
                  <span className="font-futura-500 tabular-nums">
                    {line.qty}
                  </span>
                </span>
                <div className="inline-flex items-center rounded-full border border-mundo-black/30 bg-white px-2 py-1">
                  <button
                    type="button"
                    className="px-1 text-lg leading-none text-mundo-black disabled:opacity-40"
                    onClick={() => handleChangeQty(line.productId, -1)}
                    disabled={line.qty <= 1}
                    aria-label="Diminuisci quantità"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="px-1 text-lg leading-none text-mundo-black"
                    onClick={() => handleChangeQty(line.productId, 1)}
                    aria-label="Aumenta quantità"
                  >
                    +
                  </button>
                </div>
                <span className="font-futura-400">
                  {formatEur(line.priceEur)} cad.
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <p className="font-futura-500 text-lg text-mundo-black">
                {formatEur(line.priceEur * line.qty)}
              </p>
              <button
                type="button"
                className="font-futura-500 text-sm text-mundo-black/60 underline underline-offset-2 hover:text-mundo-black"
                onClick={() => removeFromCart(line.productId)}
              >
                Rimuovi
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-3 border-y border-mundo-black/15 py-4">
        <div className="flex min-h-[80px] flex-col items-start justify-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="font-futura-500 text-xl text-mundo-black">
              <span className="font-futura-500 font-bold">Totale:</span>{" "}
              {formatEur(total)}
            </p>
            <p className="mt-1 font-futura-400 text-sm text-mundo-black/60">
              Spedizione calcolata al checkout
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-mundo-black/20 px-6 py-2.5 font-futura-500 text-mundo-black transition-colors hover:bg-mundo-black/5"
            >
              Continua lo shopping
            </Link>
            <button
              type="button"
              disabled={checkoutLoading}
              onClick={handleCheckout}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-transparent bg-mundo-black px-6 py-2.5 font-futura-500 font-medium text-mundo-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-mundo-black hover:bg-mundo-white hover:text-mundo-black hover:shadow-lg hover:shadow-mundo-black/15 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:border-transparent disabled:hover:bg-mundo-black disabled:hover:text-mundo-white disabled:hover:shadow-sm"
            >
              {checkoutLoading ? "Reindirizzamento…" : "Vai al pagamento"}
            </button>
          </div>
        </div>
        {checkoutError ? (
          <p className="font-futura-400 text-sm text-red-700" role="alert">
            {checkoutError}
          </p>
        ) : null}
      </div>

      <section className="mt-10 pt-8">
        <h2 className="mb-4 font-futura-500 text-lg uppercase tracking-[0.18em] text-mundo-black">
          Potrebbe piacerti anche
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <article className="flex gap-4 rounded-xl border border-mundo-black/10 bg-mundo-white/80 p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-mundo-black/10 bg-white">
              <img
                src="/images/gift%20pack.jpeg"
                alt=""
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-futura-500 text-sm uppercase text-mundo-black">
                Gift Pack
              </p>
              <p className="mt-1 font-futura-400 text-sm text-mundo-black/70">
                Proteggi la tua bottiglia di Mundo Gin
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-futura-500 text-sm text-mundo-black">
                  {formatEur(4)}
                </p>
                <button
                  type="button"
                  className="rounded-full border border-mundo-black px-3 py-1 text-xs font-futura-500 uppercase tracking-wide text-mundo-black hover:bg-mundo-black hover:text-mundo-white transition-colors"
                  onClick={() =>
                    addToCart({
                      productId: "gift-pack",
                      name: "Gift Pack",
                      subtitle: "Proteggi la tua bottiglia di Mundo Gin",
                      priceEur: 4,
                      qty: 1,
                      image: "/images/gift%20pack.jpeg",
                    })
                  }
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </article>
          <article className="flex gap-4 rounded-xl border border-mundo-black/10 bg-mundo-white/80 p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-mundo-black/10 bg-white">
              <img
                src="/images/recoaro.png"
                alt=""
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-futura-500 text-sm uppercase text-mundo-black">
                Acqua Brillante Recoaro (Conf. 6 pz)
              </p>
              <p className="mt-1 font-futura-400 text-sm text-mundo-black/70">
                Una tonica italiana dal gusto fresco, unico ed inimitabile
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-futura-500 text-sm text-mundo-black">
                  {formatEur(4.5)}
                </p>
                <button
                  type="button"
                  className="rounded-full border border-mundo-black px-3 py-1 text-xs font-futura-500 uppercase tracking-wide text-mundo-black transition-colors hover:bg-mundo-black hover:text-mundo-white"
                  onClick={() =>
                    addToCart({
                      productId: "recoaro-x6",
                      name: "Acqua Brillante Recoaro (Conf. 6 pz)",
                      subtitle:
                        "Una tonica italiana dal gusto fresco, unico ed inimitabile",
                      priceEur: 4.5,
                      qty: 1,
                      image: "/images/recoaro.png",
                    })
                  }
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
