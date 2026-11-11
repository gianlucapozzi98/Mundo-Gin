import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPromoterByCode,
  getRegisterableEvent,
} from "@/lib/club/catalog";
import { EventRegistrationPage } from "../../EventRegistrationPage";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string; ref: string }>;
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
