export type ClubPromoter = {
  name: string;
  code: string;
  /** Vecchi path ancora accettati (redirect logico in registrazione). */
  aliases?: string[];
  /**
   * Password login pannello PR (default: nome minuscolo senza spazi/accenti).
   * Es. "Pausa Caffè" → pausacaffe, "Rubin" → rubin.
   */
  loginPassword?: string;
};

export type ClubEventDetails = {
  slug: string;
  title: string;
  /** Short label for slideshow */
  shortDate: string;
  shortLocation: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  address: string;
  imageUrl: string;
  description: string[];
  promoters: ClubPromoter[];
  whatsappCommunityUrl: string;
};

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/KkPuaFhnvBKD8Xw2EyYBL0";

export const PRIVACY_POLICY_URL =
  "https://www.iubenda.com/privacy-policy/58280897";

/** Nome PR → password: minuscolo, senza spazi né accenti. */
export function promoterLoginPassword(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Eventi con pagina registrazione dedicata. */
export const REGISTERABLE_EVENTS: Record<string, ClubEventDetails> = {
  "mundo-castel": {
    slug: "mundo-castel",
    title: "Mundo Castel",
    shortDate: "Settembre 2026",
    shortLocation: "Bergamo",
    dateLabel: "20 settembre 2026",
    timeLabel: "18:00 – 00:00",
    location: "Pagazzano (BG)",
    address: "Piazza Castello, 1, Pagazzano (BG)",
    imageUrl: "/images/Mundo-Gin-castello-pagazzano.JPG",
    description: [
      "Mundo Club presenta: Mundo Castel.",
      "Una serata all'interno di uno dei castelli medievali meglio conservati della Lombardia, circondato dal suo storico fossato e da oltre mille anni di storia. Tra antiche mura, cocktail e buona musica, daremo vita al primo incontro della community Mundo.",
      "L'ingresso è gratuito con registrazione. Prenota il tuo accesso, salva il QR e mostralo all'ingresso.",
    ],
    promoters: [
      { name: "Pausa Caffè", code: "pc", aliases: ["pausa-caffe"] },
      { name: "Rubin", code: "rg", aliases: ["rub"] },
    ],
    whatsappCommunityUrl: WHATSAPP_COMMUNITY_URL,
  },
};

export function getRegisterableEvent(slug: string) {
  return REGISTERABLE_EVENTS[slug] ?? null;
}

export function listAllPromoters() {
  const byCode = new Map<string, ClubPromoter>();
  for (const event of Object.values(REGISTERABLE_EVENTS)) {
    for (const promoter of event.promoters) {
      byCode.set(promoter.code, promoter);
    }
  }
  return [...byCode.values()];
}

export function getPromoterByCode(slug: string, code: string | undefined) {
  if (!code) return null;
  const event = getRegisterableEvent(slug);
  if (!event) return null;
  const normalized = code.trim().toLowerCase();
  return (
    event.promoters.find(
      (p) =>
        p.code === normalized ||
        p.aliases?.some((alias) => alias === normalized)
    ) ?? null
  );
}

export function isValidPromoterCode(slug: string, code: string) {
  return Boolean(getPromoterByCode(slug, code));
}
