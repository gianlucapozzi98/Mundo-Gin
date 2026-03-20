"use client";

import { motion } from "motion/react";

export function StorySection() {
  return (
    <section className="relative z-10 min-h-screen py-16 sm:py-20 lg:py-32 bg-mundo-black w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-mundo-black aspect-square rounded-lg overflow-hidden min-h-[280px] border border-mundo-white/10">
              <img
                src="/images/mundo-still4.png"
                alt="Mundo Gin"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2
              className="text-mundo-white font-futura-500 font-medium mb-6 uppercase leading-tight"
              style={{ fontSize: "60px", lineHeight: "69px" }}
            >
              <span className="block sm:whitespace-nowrap">Il gin che racconta</span>
              <span className="block sm:whitespace-nowrap">il mondo</span>
            </h2>
            <p className="text-mundo-white/80 font-futura-400 text-[22px] leading-relaxed">
              Un gin contemporaneo, autentico, capace di distinguersi al palato
              e alla vista. Mundo vuole raccontare una storia attraverso ogni
              sorso e portare le persone a scoprire nuovi mondi, uno spirito alla
              volta.
            </p>
            <p className="text-mundo-white/80 font-futura-400 text-[22px] leading-relaxed mt-6">
              Ogni bottiglia racchiude un viaggio sensoriale che attraversa culture e sapori lontani. Dal caffè alle note botaniche, ogni sorso è un invito ad esplorare nuovi orizzonti.
            </p>
            <p className="mt-8 pt-6 border-t border-mundo-white/20 font-futura-400 text-mundo-gold/90 text-base sm:text-lg tracking-wide">
              Il nostro gin / 45°29&apos; 14.32&apos;&apos; N – 9° 38&apos; 52.93&apos;&apos; W / la tua avventura
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
