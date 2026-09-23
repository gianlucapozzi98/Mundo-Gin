import Link from "next/link";
import type { ClubEventDetails } from "@/lib/club/catalog";
import { isEventRegistrationOpen } from "@/lib/club/catalog";
import { EventRegistrationForm } from "./EventRegistrationForm";

type Props = {
  event: ClubEventDetails;
  promoterCode: string | null;
};

export function EventRegistrationPage({ event, promoterCode }: Props) {
  const registrationOpen = isEventRegistrationOpen(event);
  const dateLine = [event.dateLabel, event.timeLabel]
    .filter(Boolean)
    .join(" · ");
  const description = event.description.map((paragraph, index) => {
    if (
      index === 0 &&
      promoterCode === "pc" &&
      paragraph.startsWith("Mundo Club presenta:")
    ) {
      return paragraph.replace(/\.$/, "") + ", in collaborazione con Pausa Caffè.";
    }
    return paragraph;
  });

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 sm:pt-28">
      <div className="container mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mb-8">
          <Link
            href="/club"
            className="inline-block font-futura-500 text-mundo-black/70 transition-colors hover:text-mundo-black"
          >
            ← Torna a Mundo Club
          </Link>
        </div>

        <div
          className={`grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-14 ${
            promoterCode === "pc" ? "gap-5" : "gap-10"
          }`}
        >
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
            {promoterCode === "pc" ? (
              <div className="mt-4 -mb-1 flex justify-center lg:hidden">
                <img
                  src="/images/pausa-caffe-logo.png"
                  alt="Pausa Caffè"
                  className="h-[4.6rem] w-auto object-contain"
                />
              </div>
            ) : null}
          </div>

          <div>
            <p className="font-futura-500 text-xs uppercase tracking-[0.18em] text-mundo-black/55">
              Mundo Club
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-5">
              <h1 className="font-futura-500 text-4xl font-medium uppercase text-mundo-black sm:text-5xl">
                {event.title}
              </h1>
              {promoterCode === "pc" ? (
                <img
                  src="/images/pausa-caffe-logo.png"
                  alt="Pausa Caffè"
                  className="hidden h-14 w-auto object-contain lg:block lg:h-16"
                />
              ) : null}
            </div>
            {dateLine ? (
              <p className="mt-4 font-futura-400 text-[20px] text-mundo-black/75">
                {dateLine}
              </p>
            ) : null}
            {event.address ? (
              <p className="mt-2 font-futura-400 text-[18px] text-mundo-black/70">
                {event.address}
              </p>
            ) : null}

            <div className="mt-8 space-y-4">
              {description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-futura-400 text-[18px] leading-relaxed text-mundo-black/80 sm:text-[20px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10">
              {registrationOpen ? (
                <EventRegistrationForm
                  event={event}
                  promoterCode={promoterCode}
                />
              ) : (
                <div className="rounded-2xl border border-mundo-black/10 bg-mundo-white p-6 sm:p-8">
                  <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
                    Registrazioni chiuse
                  </p>
                  <h2 className="mt-3 font-futura-500 text-2xl uppercase text-mundo-black sm:text-3xl">
                    Non è più possibile registrarsi
                  </h2>
                  <p className="mt-3 font-futura-400 text-[17px] leading-relaxed text-mundo-black/70">
                    Le iscrizioni per questo evento sono terminate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
