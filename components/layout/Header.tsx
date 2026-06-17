"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getCart } from "@/lib/cart";

const LEFT_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Mundo" },
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

const LIQUID_GLASS_NAV =
  "border border-white/55 bg-gradient-to-b from-white/55 via-white/35 to-white/25 backdrop-blur-[28px] backdrop-saturate-[1.85] shadow-[0_14px_44px_-10px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(255,255,255,0.3)] ring-1 ring-inset ring-white/25";

const LIQUID_GLASS_NAV_MOBILE_OPEN =
  "max-md:mx-3 max-md:mt-2 max-md:w-[calc(100%-24px)] max-md:rounded-[1.35rem] max-md:py-3 max-md:border max-md:border-white/50 max-md:bg-gradient-to-b max-md:from-white/45 max-md:via-white/30 max-md:to-white/20 max-md:backdrop-blur-[24px] max-md:backdrop-saturate-[1.75] max-md:shadow-[0_10px_36px_-12px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] max-md:ring-1 max-md:ring-inset max-md:ring-white/20";

const LIQUID_GLASS_BTN =
  "rounded-full border border-white/50 bg-white/30 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-all duration-300 hover:border-white/70 hover:bg-white/45 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]";

const LIQUID_GLASS_MENU_OPEN =
  "max-md:from-white/55 max-md:via-white/40 max-md:to-white/30 max-md:backdrop-blur-[30px] max-md:backdrop-saturate-[1.9]";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncCart = () => {
      try {
        const lines = getCart();
        const total = lines.reduce((sum, line) => sum + line.qty, 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };
    syncCart();
    window.addEventListener("mundo-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("mundo-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const linkClass = "text-mundo-black";
  const menuHoverColorClass = "text-mundo-black";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1001] transition-all duration-300"
    >
      <nav
        className={`mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-all duration-500 ease-out ${
          isScrolled
            ? `max-w-[56rem] mx-3 mt-2 w-[calc(100%-24px)] rounded-[1.35rem] py-[7px] sm:mx-auto sm:w-auto md:mt-3 ${LIQUID_GLASS_NAV}`
            : mobileMenuOpen
              ? `max-w-7xl bg-transparent ${LIQUID_GLASS_NAV_MOBILE_OPEN}`
              : "max-w-7xl bg-transparent"
        } ${mobileMenuOpen ? LIQUID_GLASS_MENU_OPEN : ""}`}
      >
        <div className="relative flex items-center justify-between">
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
                src="/images/Logo 5 n.png"
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
            href="/carrello"
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center gap-1.5 rounded-lg p-2 text-mundo-black transition-colors hover:bg-mundo-black/10 md:inline-flex"
            aria-label="Carrello"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="inline-flex min-w-[21px] items-center justify-center rounded-full bg-mundo-black px-1.5 text-[11px] font-futura-500 leading-none text-mundo-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/"
            className="md:hidden inline-flex items-center justify-center shrink-0"
            aria-label="Mundo Gin Home"
          >
            <img
              src="/images/Logo 5 n.png"
              alt="Mundo Gin"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="md:hidden inline-flex items-center gap-1.5">
            <Link
              href="/carrello"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg p-2 text-mundo-black transition-colors hover:bg-mundo-black/10"
              aria-label="Carrello"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-mundo-black px-1.5 text-[10px] font-futura-500 leading-none text-mundo-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              className={`shrink-0 p-2.5 text-mundo-black ${LIQUID_GLASS_BTN}`}
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
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-white/35"
            >
              <ul
                className="space-y-1 py-4 font-futura-500 text-base font-medium text-mundo-black"
                style={{ fontFamily: "var(--font-futura), sans-serif" }}
              >
                {MOBILE_NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-block rounded-xl border border-transparent px-4 py-2 transition-all duration-300 hover:border-white/45 hover:bg-white/35 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
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
