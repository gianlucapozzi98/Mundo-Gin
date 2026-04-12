import { Metadata } from "next";
import { MundoClubCollage } from "./MundoClubCollage";

export const metadata: Metadata = {
  title: "Mundo Club | Mundo Gin",
  description: "Unisciti al Mundo Club.",
};

export default function MundoClubPage() {
  return (
    <div className="bg-[#F2F2F2]">
      <MundoClubCollage />
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20"
        aria-label="Prossimamente"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-95"
          aria-hidden
        >
          <div className="relative h-full w-full">
            {/* Biglietto in alto a sinistra */}
            <img
              src="/images/biglietto.png"
              alt=""
              className="pointer-events-none absolute left-4 top-10 h-40 w-auto -rotate-6 object-contain sm:left-10 sm:h-56 lg:left-20 lg:h-72"
            />
            {/* Biglietto in basso a destra */}
            <img
              src="/images/biglietto.png"
              alt=""
              className="pointer-events-none absolute right-2 bottom-8 h-40 w-auto rotate-8 object-contain sm:right-10 sm:h-56 lg:right-20 lg:h-72"
            />
            {/* Mun ovale extra in alto a destra */}
            <img
              src="/images/mun ovale.png"
              alt=""
              className="pointer-events-none absolute right-[38px] top-5 h-20 w-auto rotate-[-10deg] object-contain sm:right-[72px] sm:top-8 sm:h-24 lg:right-[120px] lg:h-28"
            />
            {/* Mun ovale extra in basso a sinistra */}
            <img
              src="/images/mun ovale.png"
              alt=""
              className="pointer-events-none absolute left-6 bottom-10 h-20 w-auto rotate-6 object-contain sm:left-16 sm:bottom-14 sm:h-24 lg:left-28 lg:h-28"
            />
          </div>
        </div>
        <p
          className="relative z-10 text-center font-futura-500 font-medium uppercase tracking-[0.2em] text-mundo-black"
          style={{ fontSize: "clamp(31px, 10vw, 91px)", lineHeight: 1.05 }}
        >
          Coming Soon
        </p>
      </section>
    </div>
  );
}
