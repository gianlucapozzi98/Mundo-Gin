"use client";

import { motion } from "motion/react";

const CARD_BASE =
  "absolute rounded-lg border border-mundo-black/15 bg-mundo-white/70 shadow-[0_14px_30px_rgba(0,0,0,0.12)] overflow-hidden";

export function MundoClubCollage() {
  return (
    <section className="relative min-h-screen bg-[#F2F2F2] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative h-full min-h-screen flex items-center justify-center">
        <h1
          className="text-mundo-black font-futura-500 font-medium uppercase text-center leading-[0.95] relative z-20"
          style={{ fontSize: "clamp(44px, 9vw, 132px)" }}
        >
          Mundo
          <br />
          Club
        </h1>

        {/* Left top postcard */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: -10 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={`${CARD_BASE} left-[-4%] top-[14%] w-[34vw] max-w-[260px] aspect-[4/5] rotate-[-5deg] z-10`}
        >
          <div className="w-full h-full bg-mundo-white/60" />
        </motion.div>

        {/* Left bottom postcard */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: -8 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
          className={`${CARD_BASE} left-[16%] bottom-[22%] w-[28vw] max-w-[220px] aspect-[3/4] rotate-[6deg] z-30`}
        >
          <div className="w-full h-full bg-mundo-white/60" />
        </motion.div>

        {/* Right top postcard */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: -12 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, delay: 0.05, ease: "easeOut" }}
          className={`${CARD_BASE} right-[18%] top-[12%] w-[28vw] max-w-[220px] aspect-[3/4] rotate-[5deg] z-30`}
        >
          <div className="w-full h-full bg-mundo-white/60" />
        </motion.div>

        {/* Right bottom postcard */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: -10 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className={`${CARD_BASE} right-[-2%] bottom-[24%] w-[34vw] max-w-[260px] aspect-[4/5] rotate-[-4deg] z-10`}
        >
          <div className="w-full h-full bg-mundo-white/60" />
        </motion.div>
      </div>
    </section>
  );
}

