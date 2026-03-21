"use client";

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
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-4 sm:px-6 lg:px-8 lg:px-12 xl:px-16 pb-6 sm:pb-14 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1
            className="text-mundo-black font-futura-500 font-medium mb-8 tracking-tight uppercase text-[57px] leading-[66px] sm:text-[60px] sm:leading-[69px]"
          >
            <span className="block sm:whitespace-nowrap">Scopri il sapore del mondo</span>
            <span className="block sm:whitespace-nowrap">con il gusto di Mundo</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
