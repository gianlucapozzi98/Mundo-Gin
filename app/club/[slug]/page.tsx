import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegisterableEvent } from "@/lib/club/catalog";
import { EventRegistrationPage } from "../EventRegistrationPage";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, pageMetadata, organizationJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getRegisterableEvent(slug);
  if (!event) return { title: "Evento | Mundo Club" };
  return pageMetadata({
    title: `${event.title} | Mundo Club`,
    description: `${event.title} — ${event.dateLabel}, ${event.address}`,
    path: `/club/${event.slug}`,
    image: { url: event.imageUrl, alt: event.title },
  });
}

export default async function ClubEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getRegisterableEvent(slug);
  if (!event) notFound();

  const eventJsonLd = event.startDate
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `${event.title} — Mundo Club`,
        description: event.description.join(" ").replace(/\*\*/g, ""),
        startDate: event.startDate,
        ...(event.endDate ? { endDate: event.endDate } : {}),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: absoluteUrl(event.imageUrl),
        url: absoluteUrl(`/club/${event.slug}`),
        location: {
          "@type": "Place",
          name: event.location,
          address: event.address,
        },
        organizer: {
          "@type": "Organization",
          name: organizationJsonLd.name,
          url: organizationJsonLd.url,
        },
      }
    : null;

  return (
    <>
      {eventJsonLd ? <JsonLd data={eventJsonLd} /> : null}
      <EventRegistrationPage event={event} promoterCode={null} />
    </>
  );
}
