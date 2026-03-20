"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ProductShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0.2, 0.5], [80, -80]);
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.65, 0.9],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={containerRef}
      className="relative z-10 pt-16 sm:pt-20 lg:pt-32 pb-0 bg-mundo-black overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          style={{ opacity }}
          className="text-center mb-0"
        >
          <h2 className="text-mundo-gold font-futura-500 font-medium mb-4 uppercase" style={{ fontSize: "60px", lineHeight: "69px" }}>
            La Bottiglia
          </h2>
          <div className="text-mundo-white/80 font-futura-400 text-[22px] max-w-2xl mx-auto space-y-4">
            <p>
              Satinata e minimale, la bottiglia si distingue per le sue linee pulite e raffinate, che riflettono l'equilibrio tra stile italiano e spirito esploratore.
            </p>
            <p>
              La scritta stilografata e la mappa del mondo in trasparenza, evidenziano il design moderno che riflette l'anima cosmopolita e l'eleganza distintiva di Mundo Gin.
            </p>
          </div>
        </motion.div>

        <motion.div
          style={{ y }}
          className="relative flex justify-center items-end gap-4 lg:gap-6 mt-[180px] sm:mt-[252px] lg:mt-[324px]"
        >
          {/* Bottiglia sinistra — +20% ulteriore (totale 1.44x), margine per non sovrapporre il testo */}
          <div className="hidden sm:flex flex-1 justify-end items-end h-[400px] max-w-[280px] lg:max-w-[360px] overflow-visible">
            <img
              src="/images/Bottiglia sinistra.png"
              alt="Mundo Gin bottiglia"
              className="w-full h-full object-contain object-bottom min-h-0 scale-[1.44]"
              style={{ transformOrigin: "bottom center" }}
            />
          </div>
          {/* Bottiglia centrale */}
          <div className="flex-shrink-0 h-[400px] w-[280px] sm:w-[360px] lg:w-[420px] flex items-end justify-center overflow-visible">
            <img
              src="/images/Bottiglia centrale.png"
              alt="Mundo Gin bottiglia"
              className="w-full h-full object-contain object-bottom min-h-0 scale-[1.44]"
              style={{ transformOrigin: "bottom center" }}
            />
          </div>
          {/* Bottiglia destra */}
          <div className="hidden sm:flex flex-1 justify-start items-end h-[400px] max-w-[280px] lg:max-w-[360px] overflow-visible">
            <img
              src="/images/Bottiglia destra.png"
              alt="Mundo Gin bottiglia"
              className="w-full h-full object-contain object-bottom min-h-0 scale-[1.44]"
              style={{ transformOrigin: "bottom center" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
