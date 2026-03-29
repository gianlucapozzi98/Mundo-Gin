"use client";

import { motion } from "motion/react";

const CARD_BASE =
  "absolute rounded-lg border border-mundo-black/15 bg-mundo-white shadow-[0_14px_30px_rgba(0,0,0,0.12)] overflow-hidden";

const POSTCARD_IMAGES = [
  "/images/maneken-41NL066.png",
  "/images/tech.jpg",
  "/images/IMG_5692.jpeg",
  "/images/DSC06345.jpg",
] as const;

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

        {/* Left top postcard — +10% vs previous w/max-w */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: -10 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={`${CARD_BASE} left-[-4%] top-[calc(14%_+_40px)] w-[37.4vw] max-w-[286px] aspect-[4/5] rotate-[-5deg] z-10`}
        >
          <img
            src={POSTCARD_IMAGES[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Left bottom postcard */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: -8 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
          className={`${CARD_BASE} left-[16%] bottom-[calc(22%_-_40px)] w-[30.8vw] max-w-[242px] aspect-[3/4] rotate-[6deg] z-30`}
        >
          <img
            src={POSTCARD_IMAGES[1]}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Right top postcard */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: -12 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, delay: 0.05, ease: "easeOut" }}
          className={`${CARD_BASE} right-[18%] top-[calc(12%_+_40px)] w-[30.8vw] max-w-[242px] aspect-[3/4] rotate-[5deg] z-30`}
        >
          <img
            src={POSTCARD_IMAGES[2]}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Right bottom postcard */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: -10 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className={`${CARD_BASE} right-[-2%] bottom-[calc(24%_-_40px)] w-[37.4vw] max-w-[286px] aspect-[4/5] rotate-[-4deg] z-10`}
        >
          <img
            src={POSTCARD_IMAGES[3]}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.65, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[25] mx-auto max-w-2xl px-6 pb-8 text-center font-futura-400 text-[18px] leading-snug text-mundo-black/85 sm:pb-10 sm:text-[22px] lg:pb-12 lg:text-[24px]"
      >
        More than a drink. A world to belong to.
      </motion.p>
    </section>
  );
}

