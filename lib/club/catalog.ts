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
  /** Logo partner sotto la locandina. */
  partnerLogoUrl?: string;
  partnerLogoAlt?: string;
  instagramUrl?: string;
  /** Cap iscrizioni pubbliche (es. 100 QR birra gratis). */
  maxRegistrations?: number;
  /** ISO 8601; dopo quest'ora la pagina pubblica di registrazione si chiude. */
  registrationClosesAt?: string;
  /** Pulsante Instagram obbligatorio (WhatsApp facoltativo) prima del QR. */
  requireSocialProof?: boolean;
};

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/KkPuaFhnvBKD8Xw2EyYBL0";

export const INSTAGRAM_URL = "https://www.instagram.com/mundodrygin/";

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

/** Eventi gestibili da admin / check-in (anche senza pagina registrazione pubblica). */
export const REGISTERABLE_EVENTS: Record<string, ClubEventDetails> = {
  "milan-fashion-week": {
    slug: "milan-fashion-week",
    title: "Milan Fashion Week",
    shortDate: "25 settembre 2026",
    shortLocation: "Milano",
    dateLabel: "25 settembre 2026",
    timeLabel: "",
    location: "Milano",
    address: "The Manhattan, Milano",
    imageUrl: "/images/Mundo-Gin-manhattan.JPG",
    description: [
      "Mundo Club presenta: Milan Fashion Week at The Manhattan.",
      "Registrati gratuitamente e ricevi la tua Mundo Beer.",
    ],
    promoters: [],
    whatsappCommunityUrl: WHATSAPP_COMMUNITY_URL,
    partnerLogoUrl: "/images/crz-logo.png",
    partnerLogoAlt: "CRZ",
    instagramUrl: INSTAGRAM_URL,
    maxRegistrations: 100,
    registrationClosesAt: "2026-09-25T18:00:00+02:00",
    requireSocialProof: true,
  },
  "mundo-castle": {
    slug: "mundo-castle",
    title: "Mundo Castle",
    shortDate: "Settembre 2026",
    shortLocation: "Bergamo",
    dateLabel: "20 settembre 2026",
    timeLabel: "18:00 – 00:00",
    location: "Pagazzano (BG)",
    address: "Piazza Castello, 1, Pagazzano (BG)",
    imageUrl: "/images/Mundo-Gin-castle-pagazzano.JPG",
    description: [
      "Mundo Club presenta: Mundo Castle.",
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

/** Vecchi path ancora validi (es. link PR già condivisi). */
const EVENT_SLUG_ALIASES: Record<string, string> = {
  "mundo-castel": "mundo-castle",
};

export function resolveEventSlug(slug: string) {
  return EVENT_SLUG_ALIASES[slug] ?? slug;
}

/** Tutti gli slug DB possibili per un evento (canonico + alias). */
export function eventSlugCandidates(slug: string) {
  const canonical = resolveEventSlug(slug);
  const aliases = Object.entries(EVENT_SLUG_ALIASES)
    .filter(([, to]) => to === canonical)
    .map(([from]) => from);
  return [...new Set([canonical, slug, ...aliases])];
}

export function getRegisterableEvent(slug: string) {
  return REGISTERABLE_EVENTS[resolveEventSlug(slug)] ?? null;
}

export function isEventRegistrationOpen(
  event: ClubEventDetails | null | undefined
) {
  if (!event) return false;
  if (!event.registrationClosesAt) return true;
  return Date.now() < new Date(event.registrationClosesAt).getTime();
}

export function listRegisterableEvents() {
  return Object.values(REGISTERABLE_EVENTS);
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
