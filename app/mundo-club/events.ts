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
    id: "event-castello-pagazzano-2026",
    title: "MUNDO CLUB #1",
    date: "Settembre 2026",
    location: "Bergamo",
    imageUrl: "/images/Mundo-Gin-castello-pagazzano.JPG",
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
