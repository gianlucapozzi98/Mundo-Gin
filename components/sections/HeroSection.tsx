"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0 bg-mundo-white" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[position:calc(100%+230px)_50%] md:bg-center"
          style={{ backgroundImage: "url(/images/image-01-hero.png)" }}
        />
      </div>
      <div className="fixed inset-0 z-0 bg-white/20 pointer-events-none" aria-hidden />
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1
            className="text-mundo-black font-futura-500 font-medium mb-8 tracking-tight uppercase"
            style={{ fontSize: "60px", lineHeight: "69px" }}
          >
            <span className="block sm:whitespace-nowrap">Scopri il sapore del mondo</span>
            <span className="block sm:whitespace-nowrap">con il gusto di Mundo</span>
          </h1>
          <Link
            href="/il-gin"
            className="inline-block px-8 py-4 bg-mundo-black text-mundo-white font-futura-500 font-medium text-lg rounded-full hover:bg-mundo-black/90 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            Scopri di Più
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
