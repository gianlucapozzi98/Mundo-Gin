import { Metadata } from "next";
import { IlGinHero } from "./IlGinHero";

export const metadata: Metadata = {
  title: "Il Gin | Mundo Gin",
  description:
    "Storia e processo produttivo di Mundo Gin - Premium Italian Gin.",
};

export default function IlGinPage() {
  return (
    <div className="pt-24 sm:pt-28 bg-[#F2F2F2]">
      <IlGinHero />

      <section className="py-16 sm:py-20 lg:py-32 bg-[#F2F2F2]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="aspect-[16/10] rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="/images/vic%20gian.jpeg"
                alt="Processo produttivo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                La nostra storia
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed">
                Mundo rappresenta l&apos;incontro tra avventura e raffinatezza. È
                l&apos;essenza di chi cerca sempre qualcosa di nuovo, chi ama
                esplorare orizzonti sconosciuti e scoprire sapori che raccontano
                storie.
                <br />
                <br />
                Tradizionalità ed eleganza italiana si fondono con
                l&apos;innovazione, dando vita a prodotti che trasmettono
                l&apos;amore per l&apos;artigianato e il design, offrendo sapori
                audaci e ricchi di sfumature.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                La distillazione
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed">
                Nel cuore delle valli bergamasche nasce DOA Orobica, distilleria
                artigianale dove esperienza, passione e innovazione si
                incontrano.
                <br />
                <br />
                È proprio qui che prende vita Mundo Gin: da lavorazioni in
                piccoli lotti e tramite l&apos;utilizzo di materie prime
                selezionate, nasce un distillato di altissima qualità, autentico
                e riconoscibile.
                <br />
                <br />
                Prodotto secondo il metodo London Dry, il caffè, cuore aromatico
                di Mundo, viene distillato in caldaia e in corrente di vapore
                insieme ad altre botaniche per preservarne la naturale
                intensità.
              </p>
            </div>
            <div className="aspect-[16/10] order-1 lg:order-2 relative overflow-visible">
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <img
                  src="/images/doa.jpg"
                  alt="DOA Orobica distilleria"
                  className="w-full h-full object-cover"
                />
              </div>
              <img
                src="/images/Logo 5 n.png"
                alt=""
                aria-hidden
                className="absolute -top-[43px] -right-[43px] w-[144px] h-auto opacity-90 rotate-6 drop-shadow-md z-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="aspect-[16/10] rounded-lg overflow-hidden">
              <img
                src="/images/tost.jpeg"
                alt="Tostatura caffè per Mundo Gin"
                className="w-full h-full object-cover object-bottom"
              />
            </div>
            <div>
              <h2 className="text-mundo-black font-futura-500 font-medium text-3xl sm:text-4xl mb-6">
                Il caffè
              </h2>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed">
                Per arricchire il profilo aromatico di Mundo Gin, abbiamo scelto
                due caffè specialty di alta qualità provenienti da Cafézal,
                torrefazione milanese d’eccellenza. Chicchi selezionati e tostati
                con precisione, capaci di donare profondità, rotondità e
                carattere al distillato, senza mai sovrastarlo.
              </p>
              <p className="font-futura-400 text-mundo-black/80 text-[22px] leading-relaxed mt-6">
                Note di cioccolato fondente, mandorla e un delicato retrogusto di
                mora, si uniscono a note di cioccolato fondente, fave di cacao e
                frutti di bosco.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
