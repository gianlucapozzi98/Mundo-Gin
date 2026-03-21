import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | Mundo Gin",
  description: "Acquista Mundo Gin.",
};

export default function ShopPage() {
  return (
    <div className="pt-24 sm:pt-28 min-h-screen py-16 bg-[#F2F2F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-mundo-black font-futura-500 font-medium text-4xl mb-6">
          Shop
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article className="group">
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
            <h2 className="mt-4 text-mundo-black font-futura-500 font-medium text-2xl">
              Mundo Gin
            </h2>
          </article>
        </div>
      </div>
    </div>
  );
}
