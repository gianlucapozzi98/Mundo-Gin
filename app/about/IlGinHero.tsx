"use client";

import { motion } from "motion/react";

export function IlGinHero() {
  return (
    <section className="h-[190px] flex flex-col justify-center bg-transparent text-mundo-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-mundo-black font-futura-500 font-medium mb-6 uppercase"
          style={{ fontSize: "70px", lineHeight: "48px" }}
        >
          Mundo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-futura-400 text-lg sm:text-xl text-mundo-black/70 max-w-2xl"
        >
          Storia e processo produttivo di Mundo Gin
        </motion.p>
      </div>
    </section>
  );
}
