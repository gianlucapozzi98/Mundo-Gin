import Link from "next/link";
import type { ClubEventDetails } from "@/lib/club/catalog";
import { EventRegistrationForm } from "./EventRegistrationForm";

type Props = {
  event: ClubEventDetails;
  promoterCode: string | null;
};

export function EventRegistrationPage({ event, promoterCode }: Props) {
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

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="font-futura-500 text-xs uppercase tracking-[0.18em] text-mundo-black/55">
              Mundo Club
            </p>
            <h1 className="mt-3 font-futura-500 text-4xl font-medium uppercase text-mundo-black sm:text-5xl">
              {event.title}
            </h1>
            <p className="mt-4 font-futura-400 text-[20px] text-mundo-black/75">
              {event.dateLabel} · {event.timeLabel}
            </p>
            <p className="mt-2 font-futura-400 text-[18px] text-mundo-black/70">
              {event.address}
            </p>

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
              {promoterCode === "pc" ? (
                <div className="mb-6 flex justify-center sm:justify-start">
                  <img
                    src="/images/pausa-caffe-logo.png"
                    alt="Pausa Caffè"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                </div>
              ) : null}
              <EventRegistrationForm
                event={event}
                promoterCode={promoterCode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
