"use client";

import { motion } from "motion/react";

const PLACEHOLDERS = Array.from(
  { length: 8 },
  (_, i) => `[INSTAGRAM-${i + 1}]`
);

export function InstagramSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20 lg:py-32 bg-mundo-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-mundo-black font-futura-500 font-medium text-4xl sm:text-5xl lg:text-6xl mb-4">
            #MundoGin
          </h2>
          <p className="text-mundo-black/80 font-futura-400 text-[22px]">
            Seguici su Instagram
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {PLACEHOLDERS.map((placeholder, index) => (
            <motion.div
              key={placeholder}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="aspect-square bg-mundo-black/10 rounded-lg flex items-center justify-center min-h-[120px]"
            >
              <span className="text-mundo-gold/80 text-sm sm:text-base font-futura-500 font-medium text-center px-2">
                {placeholder}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
