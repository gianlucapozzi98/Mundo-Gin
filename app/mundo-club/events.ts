export type ClubEventImageLayout = "fit" | "fill" | "fill-bottom";

export type ClubEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  /** fit = intera immagine se 4:5, fill = fino al bordo, fill-bottom = fino al bordo ancorata in basso */
  imageLayout: ClubEventImageLayout;
};

/** Aggiorna questa lista man mano che pubblichi nuovi eventi Mundo Club. */
export const CLUB_EVENTS: ClubEvent[] = [
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
    imageUrl: "/images/mundo-gin-CULTURE-CIRCLE -FESTIVAL - .jpg",
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
