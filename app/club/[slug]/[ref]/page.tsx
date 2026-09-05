import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPromoterByCode,
  getRegisterableEvent,
} from "@/lib/club/catalog";
import { EventRegistrationPage } from "../../EventRegistrationPage";

type PageProps = {
  params: Promise<{ slug: string; ref: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getRegisterableEvent(slug);
  if (!event) return { title: "Evento | Mundo Club" };
  return {
    title: `${event.title} | Mundo Club`,
    description: `${event.title} — ${event.dateLabel}, ${event.address}`,
  };
}

export default async function ClubEventWithRefPage({ params }: PageProps) {
  const { slug, ref } = await params;
  const event = getRegisterableEvent(slug);
  if (!event) notFound();

  // Unknown refs still show the page, but registration saves without promoter
  const promoter = getPromoterByCode(slug, ref);

  return (
    <EventRegistrationPage
      event={event}
      promoterCode={promoter?.code ?? null}
    />
  );
}
