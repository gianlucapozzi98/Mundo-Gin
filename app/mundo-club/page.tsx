import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mundo Club | Mundo Gin",
  description: "Unisciti al Mundo Club.",
};

export default function MundoClubPage() {
  return (
    <div className="pt-24 sm:pt-28 min-h-screen py-16 bg-mundo-black text-mundo-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-mundo-gold font-futura-500 font-medium text-4xl mb-6">
          Mundo Club
        </h1>
        <p className="font-futura-400 text-mundo-white/80 text-[22px]">
          Vantaggi esclusivi e community Mundo.
        </p>
      </div>
    </div>
  );
}
