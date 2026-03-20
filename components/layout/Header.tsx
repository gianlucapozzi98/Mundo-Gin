"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/il-gin", label: "About Mundo" },
  { href: "/dove-provarci", label: "Dove provarci" },
  { href: "/shop", label: "Shop" },
  { href: "/contatti", label: "Contatti" },
];

const SCROLL_THRESHOLD = 20;

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Home e sostenibilità in alto = header trasparente; dopo scroll o altre pagine = barra scura. */
  const isLightHeader = (pathname === "/" || pathname === "/sostenibilita") && !isScrolled;
  /* Solo in Sostenibilità (in alto) le voci sono bianche; in Home in alto = nero per leggibilità sullo sfondo chiaro. */
  const isMenuWhite = pathname === "/sostenibilita" || isScrolled || pathname !== "/";
  const isSostenibilita = pathname === "/sostenibilita";
  const linkClass = isSostenibilita
    ? "text-mundo-white hover:text-mundo-white"
    : isMenuWhite
      ? "text-mundo-white hover:text-[#F2F2F2]"
      : "text-mundo-black hover:text-mundo-gold";
  const textColorClass = isMenuWhite ? "text-mundo-white" : "text-mundo-black";
  const menuHoverColorClass = isSostenibilita ? "text-mundo-white" : isMenuWhite ? "text-[#F2F2F2]" : "text-mundo-black";

  // In alto: solo voci del menu, sfondo trasparente (come home). Dopo scroll: barra scura.
  const baseHeaderBgClass = isScrolled
    ? "bg-mundo-black/50 backdrop-blur-md"
    : "bg-transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1001] transition-all duration-300 ${baseHeaderBgClass} ${
        // Solo su mobile, quando il menu è aperto, forziamo lo sfondo come quando si è scrollato
        mobileMenuOpen ? "bg-mundo-black/50 backdrop-blur-md md:bg-inherit md:backdrop-blur-none" : ""
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-mundo-gold text-2xl font-futura-500 font-medium tracking-wide shrink-0"
            aria-label="Mundo Gin Home"
          >
            MUNDO
          </Link>

          <ul
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 lg:gap-8 font-futura-500 font-medium text-base"
            style={{ fontFamily: "var(--font-futura), sans-serif" }}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`inline-block group ${linkClass.split(" ")[0]}`}
                >
                  <div className="relative overflow-hidden">
                    <span className="text-sm uppercase tracking-wider block static group-hover:-translate-y-full transition-all duration-500">
                      {label}
                    </span>
                    <span className={`text-sm uppercase tracking-wider block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0 ${menuHoverColorClass}`}>
                      {label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block w-24 shrink-0" aria-hidden />

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className={`md:hidden p-2 shrink-0 rounded-lg transition-colors ${
              mobileMenuOpen
                ? "text-[#F2F2F2] hover:bg-mundo-white/10"
                : isMenuWhite
                  ? "text-[#F2F2F2] hover:bg-mundo-white/10"
                  : "text-mundo-black hover:bg-mundo-black/10"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <ul
                className={`py-4 space-y-2 font-futura-500 font-medium text-base ${mobileMenuOpen ? "text-mundo-white" : textColorClass}`}
                style={{ fontFamily: "var(--font-futura), sans-serif" }}
              >
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block group py-2 px-4 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="relative overflow-hidden">
                        <span className="text-sm uppercase tracking-wider block static group-hover:-translate-y-full transition-all duration-500">
                          {label}
                        </span>
                        <span className={`text-sm uppercase tracking-wider block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0 ${mobileMenuOpen ? "text-[#F2F2F2]" : menuHoverColorClass}`}>
                          {label}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
