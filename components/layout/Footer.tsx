"use client";

import Link from "next/link";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Mundo" },
  { href: "/dove-provarci", label: "Dove provarci" },
  { href: "/shop", label: "Shop" },
  { href: "/contatti", label: "Contatti" },
];

const legalLinks = [
  { href: "https://www.iubenda.com/privacy-policy/58280897", label: "Privacy Policy" },
  {
    href: "https://www.iubenda.com/privacy-policy/58280897/cookie-policy",
    label: "Cookie Policy",
  },
  { href: "/termini-e-condizioni", label: "Termini e condizioni" },
  { href: "/sostenibilita", label: "Sostenibilità" },
];

const socialLinks = [
  { href: "https://www.instagram.com/mundodrygin/", label: "Instagram" },
  { href: "https://www.facebook.com/people/Mundo-Gin/61558116593022/", label: "Facebook" },
  { href: "https://www.tiktok.com/@mundogin", label: "TikTok" },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-mundo-black/50 backdrop-blur-md text-mundo-white pt-[30px] pb-[15px] overflow-hidden">
      <div className="container relative z-10 mx-auto max-w-7xl translate-x-[70px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo + indirizzo */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Mundo Gin Home">
              <img
                src="/images/Logo principale senza payoff b.png"
                alt="Mundo Gin"
                className="h-[81px] w-auto object-contain"
              />
            </Link>
            <p
              className="font-futura-400 text-mundo-white/80"
              style={{ fontSize: "18px" }}
            >
              Mundo Gin S.N.C.
              <br />
              Via Leonardo Da Vinci 37, 24043, Caravaggio (BG)
              <br />
              P.IVA: 04745890162
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-futura-500 font-medium text-lg mb-4 uppercase">Menu</h4>
            <ul
              className="space-y-2 font-futura-500 font-medium"
              style={{
                fontSize: "18px",
                lineHeight: "20px",
              }}
            >
              {menuLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-block group text-mundo-white"
                    onClick={scrollToTop}
                  >
                    <div className="relative overflow-hidden">
                      <span className="text-sm uppercase tracking-wider block static group-hover:-translate-y-full transition-all duration-500">
                        {label}
                      </span>
                      <span className="text-sm text-mundo-gold uppercase tracking-wider block absolute bottom-0 left-0 translate-y-full transition-all duration-500 group-hover:translate-y-0">
                        {label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link utili */}
          <div>
            <h4 className="font-futura-500 font-medium text-lg mb-4 uppercase">
              Link utili
            </h4>
            <ul className="space-y-2 font-futura-500 font-medium text-sm">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  {href.startsWith("http") ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mundo-white hover:text-mundo-gold transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-mundo-white hover:text-mundo-gold transition-colors"
                      onClick={scrollToTop}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Seguici */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-futura-500 font-medium text-lg mb-4 uppercase">Seguici</h4>
            <ul
              className="space-y-2 font-futura-500 font-medium"
              style={{
                fontSize: "18px",
                lineHeight: "20px",
              }}
            >
              {socialLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mundo-white hover:text-mundo-gold transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-mundo-white/10 pb-[4px] pt-4 text-center -translate-x-[70px]">
          <p className="font-futura-400 text-sm text-mundo-white/50">
            © Mundo Gin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
