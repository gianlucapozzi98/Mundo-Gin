"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const LEFT_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/il-gin", label: "About Mundo" },
  { href: "/dove-provarci", label: "Dove provarci" },
];

const RIGHT_NAV_LINKS = [
  { href: "/mundo-club", label: "Club" },
  { href: "/shop", label: "Shop" },
  { href: "/contatti", label: "Contatti" },
];

const MOBILE_NAV_LINKS = [
  ...LEFT_NAV_LINKS,
  ...RIGHT_NAV_LINKS,
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

  // Menu desktop sempre nero per massima leggibilità su sfondi chiari/grigi.
  const isBlackTextAtTop = true;
  const linkClass = "text-mundo-black";
  const textColorClass = "text-mundo-black";
  const menuHoverColorClass = "text-mundo-black";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1001] transition-all duration-300"
    >
      <nav
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 ${
          isScrolled
            ? "max-w-[56rem] w-[calc(100%-24px)] sm:w-auto mx-3 sm:mx-auto mt-2 md:mt-3 py-[7px] rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            : "max-w-7xl bg-transparent"
        } ${
          mobileMenuOpen
            ? "bg-white/65 backdrop-blur-xl md:bg-white/55 md:backdrop-blur-xl"
            : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center w-full ${
              isScrolled ? "gap-[25px]" : "gap-[65px]"
            }`}
          >
            <ul
              className="flex items-center justify-end gap-6 lg:gap-8 font-futura-500 font-medium text-base"
              style={{ fontFamily: "var(--font-futura), sans-serif" }}
            >
              {LEFT_NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={`inline-flex items-center group ${linkClass}`}>
                    <div className="relative overflow-hidden">
                      <span className="text-sm leading-none uppercase tracking-wider block static group-hover:-translate-y-full transition-all duration-500">
                        {label}
                      </span>
                      <span
                        className={`text-sm leading-none uppercase tracking-wider block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0 ${menuHoverColorClass}`}
                      >
                        {label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/" className="inline-flex items-center justify-center" aria-label="Mundo Gin Home">
              <img
                src="/images/Logo 6 n.png"
                alt="Mundo Gin"
                className={`${isScrolled ? "h-8 lg:h-9" : "h-10 lg:h-11"} w-auto object-contain transition-all duration-300`}
              />
            </Link>

            <ul
              className="flex items-center justify-start gap-6 lg:gap-8 font-futura-500 font-medium text-base"
              style={{ fontFamily: "var(--font-futura), sans-serif" }}
            >
              {RIGHT_NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={`inline-flex items-center group ${linkClass}`}>
                    <div className="relative overflow-hidden">
                      <span className="text-sm leading-none uppercase tracking-wider block static group-hover:-translate-y-full transition-all duration-500">
                        {label}
                      </span>
                      <span
                        className={`text-sm leading-none uppercase tracking-wider block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0 ${menuHoverColorClass}`}
                      >
                        {label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/"
            className="md:hidden inline-flex items-center justify-center shrink-0"
            aria-label="Mundo Gin Home"
          >
            <img
              src="/images/Logo 6 n.png"
              alt="Mundo Gin"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
            className={`md:hidden p-2 shrink-0 rounded-lg transition-colors ${
              mobileMenuOpen
                ? "text-mundo-black hover:bg-mundo-black/10"
                : isBlackTextAtTop
                  ? "text-mundo-black hover:bg-mundo-black/10"
                  : "text-[#F2F2F2] hover:bg-mundo-white/10"
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
                className={`py-4 space-y-2 font-futura-500 font-medium text-base text-mundo-black`}
                style={{ fontFamily: "var(--font-futura), sans-serif" }}
              >
                {MOBILE_NAV_LINKS.map(({ href, label }) => (
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
                        <span className={`text-sm uppercase tracking-wider block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0 text-mundo-black`}>
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
