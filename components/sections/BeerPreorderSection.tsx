"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  MUNDO_BEER_HOME_VIDEO,
  MUNDO_BEER_IMAGE,
} from "@/lib/mundo-beer-product";

export function BeerPreorderSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {
        /* autoplay blocked until user interaction */
      });
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <section className="relative z-10 min-h-screen w-full bg-mundo-white py-16 sm:py-20 lg:py-32">
      <div className="container mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="aspect-square min-h-[280px] overflow-hidden rounded-lg border border-mundo-black/10 bg-mundo-white">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={MUNDO_BEER_IMAGE}
                aria-label="Mundo Beer"
              >
                <source src={MUNDO_BEER_HOME_VIDEO} type="video/mp4" />
              </video>
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
              className="mb-5 font-futura-500 font-medium uppercase leading-tight text-mundo-black"
              style={{ fontSize: "60px", lineHeight: "69px" }}
            >
              <span className="block sm:whitespace-nowrap">Mundo Beer</span>
              <span className="block sm:whitespace-nowrap">è finalmente disponibile</span>
            </h2>
            <Link
              href="/shop/mundo-beer"
              className="mb-8 inline-flex items-center border border-mundo-black/25 px-5 py-2 font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/85 transition-colors hover:border-mundo-black hover:text-mundo-black"
            >
              Acquista
            </Link>
            <p className="font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
              Leggera, rinfrescante e facile da bere, nasce per condividere
              momenti, persone ed esperienze.
            </p>
            <p className="mt-6 font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
              Scegli il pack che preferisci e scopri il nuovo modo di vivere
              Mundo.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
