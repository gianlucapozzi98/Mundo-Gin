import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrello | Mundo Gin",
  description: "Controlla i prodotti nel carrello.",
};

export default function CarrelloPage() {
  return (
    <div className="pt-24 sm:pt-28 min-h-screen py-16 bg-[#F2F2F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-mundo-black font-futura-500 font-medium text-4xl mb-6 uppercase">
          Carrello
        </h1>

        <div className="rounded-xl border border-mundo-black/10 bg-mundo-white p-8 sm:p-10">
          <p className="font-futura-400 text-mundo-black/70 text-[22px]">
            Il tuo carrello e vuoto.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-8 px-7 py-3 bg-mundo-black text-mundo-white font-futura-500 font-medium rounded-lg hover:bg-mundo-black/90 transition-all"
          >
            Torna allo Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

