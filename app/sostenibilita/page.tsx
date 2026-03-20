import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sostenibilità | Mundo Gin",
  description:
    "Il nostro impegno per la tutela del pianeta. Mundo Gin è alimentato al 100% da energia solare.",
};

export default function SostenibilitaPage() {
  return (
    <div className="relative min-h-screen bg-[#F2F2F2] lg:bg-gradient-to-r lg:from-[#F2F2F2] lg:to-transparent">
      {/* Desktop: immagine fissa a destra */}
      <div className="pointer-events-none fixed inset-y-0 right-0 w-1/2 z-0 hidden lg:block">
        <img
          src="/images/mundo-world-final.png"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
        />
      </div>
      {/* Mobile: immagine a tutta schermata in cima, poi si scrolla al testo */}
      <div className="relative h-screen w-full lg:hidden">
        <img
          src="/images/mundo-world-final.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
      <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-none">
          <div className="grid gap-12 lg:grid-cols-2 items-stretch">
            <div className="flex flex-col justify-center items-start px-4 sm:px-6 lg:pl-16 xl:pl-24 pt-12 lg:pt-28 -mt-0 lg:-mt-[140px] max-w-full overflow-x-hidden w-full">
              <h1
                className="text-mundo-black font-futura-500 font-medium uppercase mb-10 text-left w-full text-[56px] leading-[65px] sm:text-[60px] sm:leading-[69px]"
              >
                Sostenibilità
              </h1>
              <div className="font-futura-400 text-mundo-black/90 space-y-6 text-[20px] sm:text-[24px] leading-relaxed text-justify break-words min-w-0">
                <p>
                  Il nostro impegno è rivolto alla tutela e alla salvaguardia del pianeta. Mundo Gin è sempre alla ricerca di soluzioni sostenibili per minimizzare sprechi e ridurre l&apos;inquinamento. La qualità è il principio che guida ogni nostra scelta.
                </p>
                <p>
                  Un impegno quotidiano fatto di ricerca, passione e rigore, che si traduce in attenzione per le materie prime, per il processo produttivo e per l&apos;impatto che ogni decisione ha su ciò che ci circonda.
                </p>
                <p>
                  L&apos;imbottigliamento di Mundo Gin è alimentato al 100% da energia solare, grazie a un impianto fotovoltaico all&apos;avanguardia. Produciamo più energia di quanta ne consumiamo, riducendo il nostro impatto ambientale e contribuendo ad un futuro più sostenibile.
                </p>
                <p>
                  Unisciti a noi, scegli di essere sostenibile, riutilizza e ricicla!
                </p>
              </div>
              <p className="mt-10 font-futura-500 font-medium text-mundo-black text-[20px] sm:text-[22px]">
                Segui le regole di riciclo per proteggere il nostro pianeta!
              </p>
              <ul className="mt-6 space-y-3 font-futura-400 text-mundo-black/90 text-[20px] sm:text-[24px] break-words min-w-0">
                <li>
                  <strong>Tappo</strong> 90 C/LDPE (plastica)
                </li>
                <li>
                  <strong>Bottiglia</strong> 70 GL (vetro)
                </li>
                <li>
                  <strong>Capsula</strong> C/PVC 90 (plastica)
                </li>
              </ul>
            </div>

            <div className="relative h-full min-h-[400px] hidden lg:block">
              <img
                src="/images/mundo-world-final.png"
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover object-center lg:hidden"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
