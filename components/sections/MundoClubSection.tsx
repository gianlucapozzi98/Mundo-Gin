"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function MundoClubSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20 lg:py-32 bg-mundo-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="/images/recap9.png"
                alt="Mundo Club"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden mt-8">
              <img
                src="/images/DSC05918.jpg"
                alt="Mundo Club"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-mundo-gold font-futura-500 font-medium mb-6 uppercase" style={{ fontSize: "60px", lineHeight: "69px" }}>
              Mundo Club
            </h2>
            <p className="text-mundo-white/80 font-futura-400 text-[22px] leading-relaxed mb-8">
              Un programma dedicato a chi condivide la nostra passione per la qualità, dentro e fuori dal bancone. Mundo Club è il nostro modo di creare connessioni, offrendo esperienze e vantaggi esclusivi.
            </p>
            <Link
              href="/mundo-club"
              className="inline-block px-8 py-4 bg-mundo-gold text-mundo-black font-futura-500 font-medium rounded-full hover:bg-mundo-gold/90 transition-all min-h-[44px]"
            >
              Scopri Mundo Club
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
