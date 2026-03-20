"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BOTANICHE = [
  { id: 1, name: "Ginepro", image: "/images/Ginepro.png" },
  { id: 2, name: "Coriandolo", image: "/images/Coriandolo.png" },
  { id: 3, name: "Cardamomo", image: "/images/Cardamomo.png" },
  { id: 4, name: "Scorza d'arancia", image: "/images/Scorza d'arancia.png" },
  { id: 5, name: "Caffè", image: "/images/Caffe.png" },
  { id: 6, name: "Rosmarino", image: "/images/Rosmarino.png" },
  { id: 7, name: "Liquirizia", image: "/images/Liquirizia.png" },
  { id: 8, name: "Cannella", image: "/images/Cannella.png" },
];

export function BotanicheSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-20 lg:py-32 bg-mundo-white overflow-hidden">
      {/* Sfondo decorativo: logo ovale dietro alle card, coperto dal contenuto; su mobile più a sinistra e dietro alle card */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden
      >
        <img
          src="/images/botaniche.svg"
          alt=""
          aria-hidden
          className="absolute top-[303px] -left-[49px] sm:top-16 sm:left-6 lg:top-20 lg:left-8 w-48 sm:w-64 lg:w-72 h-auto pointer-events-none opacity-90"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl isolate">
        <h2
          ref={titleRef}
          className="text-mundo-black font-futura-500 font-medium mb-4 text-center uppercase text-[48px] leading-[55px] sm:text-[60px] sm:leading-[69px]"
        >
          Note di
          <br />
          degustazione
        </h2>
        <p className="text-mundo-black/80 font-futura-400 text-[22px] text-center max-w-4xl mx-auto mb-12 sm:whitespace-nowrap">
          Aromi speziati e agrumati al naso, gusto morbido e avvolgente, con un finale lungo e piacevolmente persistente.
        </p>
        <div className="relative overflow-x-auto overflow-y-visible scrollbar-hide py-6 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-6 min-w-max items-start">
            {BOTANICHE.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-64 sm:w-80 bg-mundo-black/5 rounded-lg p-6 border border-mundo-black/10"
              >
                <div className="aspect-square rounded-lg mb-4 overflow-hidden min-h-[200px] bg-mundo-gold/20">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-mundo-black font-futura-500 font-medium text-2xl mb-2">
                  {item.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
