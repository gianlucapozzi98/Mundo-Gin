"use client";

import Link from "next/link";
import { motion } from "motion/react";

const COCKTAILS = [
  { id: 9, name: "Mundo Tonic", image: "/images/gin tonic.png" },
  { id: 10, name: "Mundo Negroni", image: "/images/Negroni.jpeg" },
  { id: 11, name: "Espresso Mundo", image: "/images/espresso.jpeg" },
];

export function CocktailPreview() {
  return (
    <section className="relative z-10 py-16 sm:py-20 lg:py-32 bg-[#F2F2F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-mundo-black font-futura-500 font-medium mb-4 uppercase" style={{ fontSize: "60px", lineHeight: "69px" }}>
            I Nostri Cocktail
          </h2>
          <p className="text-mundo-black/80 font-futura-400 text-[22px] max-w-2xl mx-auto text-center">
            Creato per distinguersi, Mundo Gin dà il meglio di sé nei grandi classici. È versatile e inconfondibile, capace di distinguersi al palato e alla vista.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COCKTAILS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/cocktail" className="block group">
                <div className="aspect-[4/5] bg-mundo-black/10 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  {"image" in item && item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-mundo-gold text-2xl font-futura-500 font-medium">
                      {item.placeholder}
                    </span>
                  )}
                </div>
                <div className="relative overflow-hidden font-futura-500 font-medium text-2xl">
                  <span className="text-mundo-black block static group-hover:-translate-y-full transition-all duration-500">
                    {item.name}
                  </span>
                  <span className="text-mundo-black block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0">
                    {item.name}
                  </span>
                </div>
                <p className="text-mundo-black/70 font-futura-400 text-sm mt-1">
                  Scopri la ricetta →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/cocktail"
            className="inline-block px-8 py-4 bg-mundo-black text-mundo-gold font-futura-500 font-medium rounded-full hover:bg-mundo-black/90 transition-all min-h-[44px]"
          >
            Tutti i Cocktail
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
