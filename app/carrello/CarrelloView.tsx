"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatEur,
  getCart,
  removeFromCart,
  type CartLine,
} from "@/lib/cart";

export function CarrelloView() {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const sync = () => setLines(getCart());
    sync();
    window.addEventListener("mundo-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mundo-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const total = lines.reduce((sum, l) => sum + l.priceEur * l.qty, 0);

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
              <p className="font-futura-500 text-lg uppercase text-mundo-black">
                {line.name}
              </p>
              {line.subtitle ? (
                <p className="mt-1 font-futura-400 text-mundo-black/70">
                  {line.subtitle}
                </p>
              ) : null}
              <p className="mt-2 font-futura-400 text-mundo-black/80">
                Quantità: {line.qty} · {formatEur(line.priceEur)} cad.
              </p>
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
      <div className="flex flex-col gap-4 border-t border-mundo-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-futura-500 text-xl text-mundo-black">
          Totale: {formatEur(total)}
        </p>
        <Link
          href="/shop"
          className="inline-block rounded-lg border border-mundo-black/20 px-6 py-2.5 font-futura-500 text-mundo-black transition-colors hover:bg-mundo-black/5"
        >
          Continua lo shopping
        </Link>
      </div>
    </div>
  );
}
