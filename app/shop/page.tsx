import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Mundo Gin",
  description: "Acquista Mundo Gin.",
};

export default function ShopPage() {
  return (
    <div className="pt-24 sm:pt-28 min-h-screen py-16 bg-mundo-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-mundo-black font-futura-500 font-medium text-4xl mb-6">
          Shop
        </h1>
        <p className="font-futura-400 text-mundo-black/80 text-[22px]">
          Presto disponibile.
        </p>
      </div>
    </div>
  );
}
