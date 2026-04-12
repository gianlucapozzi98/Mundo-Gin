import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordine ricevuto | Mundo Gin",
  description: "Grazie per il tuo ordine su Mundo Gin.",
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function OrdineRicevutoPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="min-h-[50vh] bg-[#F2F2F2] pt-24 pb-16 sm:pt-28">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-futura-500 text-3xl font-medium uppercase tracking-wide text-mundo-black sm:text-4xl">
          Ordine ricevuto
        </h1>
        <p className="mt-6 font-futura-400 text-[22px] leading-relaxed text-mundo-black/80">
          Grazie per il tuo acquisto. Riceverai un&apos;email di conferma da
          Stripe con i dettagli del pagamento.
        </p>
        {sessionId ? (
          <p className="mt-4 font-futura-400 text-sm text-mundo-black/50">
            Riferimento sessione: {sessionId}
          </p>
        ) : null}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-mundo-black px-8 py-3 font-futura-500 font-medium text-mundo-white transition-colors hover:bg-mundo-black/90"
          >
            Torna allo shop
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-mundo-black/25 px-8 py-3 font-futura-500 text-mundo-black transition-colors hover:bg-mundo-black/5"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
