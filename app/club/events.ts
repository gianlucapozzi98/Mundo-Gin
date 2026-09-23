export type ClubEventImageLayout = "fit" | "fill" | "fill-bottom";

export type ClubEvent = {
  id: string;
  title: string;
  /** Data precisa se l'evento è in arrivo (es. "25 settembre 2026"). */
  date: string;
  /** Solo mese dopo l'evento (es. "Settembre 2026"). Se manca, resta `date`. */
  archiveDate?: string;
  /** Fine evento (ISO); dopo questa ora in lista si mostra `archiveDate`. */
  endsAt?: string;
  location: string;
  imageUrl: string;
  /** fit = intera immagine se 4:5, fill = fino al bordo, fill-bottom = fino al bordo ancorata in basso */
  imageLayout: ClubEventImageLayout;
  /** Se presente, l'evento apre la pagina di registrazione dedicata */
  href?: string;
};

export function clubEventDateLabel(event: ClubEvent) {
  if (!event.archiveDate || !event.endsAt) return event.date;
  return Date.now() < new Date(event.endsAt).getTime()
    ? event.date
    : event.archiveDate;
}

/** Aggiorna questa lista man mano che pubblichi nuovi eventi Mundo Club. */
export const CLUB_EVENTS: ClubEvent[] = [
  {
    id: "event-milan-fashion-week-2026",
    title: "MILAN FASHION WEEK",
    date: "25 settembre 2026",
    archiveDate: "Settembre 2026",
    endsAt: "2026-09-25T23:00:00+02:00",
    location: "Milano",
    imageUrl: "/images/Mundo-Gin-manhattan.JPG",
    imageLayout: "fill",
    href: "/club/milan-fashion-week",
  },
  {
    id: "event-castello-pagazzano-2026",
    title: "MUNDO CASTLE",
    date: "Settembre 2026",
    location: "Bergamo",
    imageUrl: "/images/Mundo-Gin-castle-pagazzano.JPG",
    imageLayout: "fill",
  },
  {
    id: "event-jesolo-2026",
    title: "TOSTI",
    date: "Luglio 2026",
    location: "Jesolo",
    imageUrl: "/images/Mundo-Gin-jesolo.JPG",
    imageLayout: "fill",
  },
  {
    id: "event-1",
    title: "MINIMARKET",
    date: "Giugno 2026",
    location: "Milano",
    imageUrl: "/images/Mundo-Gin-Minimarket -Milan.jpg",
    imageLayout: "fit",
  },
  {
    id: "event-2",
    title: "CULTURE CIRCLE FESTIVAL",
    date: "Maggio 2026",
    location: "Milano",
    imageUrl: "/images/mundo-gin-CULTURE-CIRCLE -FESTIVAL - .jpg?v=2",
    imageLayout: "fill",
  },
  {
    id: "event-3",
    title: "PLUG-MI",
    date: "Settembre 2025",
    location: "Milano",
    imageUrl: "/images/mundo-gin-plugmi-milano.png",
    imageLayout: "fill-bottom",
  },
];
