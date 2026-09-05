import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegisterableEvent } from "@/lib/club/catalog";
import { EventRegistrationPage } from "../EventRegistrationPage";

type PageProps = {
  params: Promise<{ slug: string }>;
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

export default async function ClubEventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getRegisterableEvent(slug);
  if (!event) notFound();

  return <EventRegistrationPage event={event} promoterCode={null} />;
}
