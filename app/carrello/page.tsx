import { Metadata } from "next";
import { CarrelloView } from "./CarrelloView";

export const metadata: Metadata = {
  title: "Carrello | Mundo Gin",
  description: "Controlla i prodotti nel carrello.",
};

export default function CarrelloPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] py-16 pt-24 sm:pt-28">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-futura-500 text-4xl font-medium uppercase text-mundo-black">
          Carrello
        </h1>

        <div className="rounded-xl border border-mundo-black/10 bg-mundo-white p-8 sm:p-10">
          <CarrelloView />
        </div>
      </div>
    </div>
  );
}

