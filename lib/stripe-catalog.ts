/** Catalogo checkout lato server (non fidarsi del client). */
export type StripeCatalogEntry = {
  stripePriceId: string;
  /** Deve coincidere con l’importo del Price su Stripe (soglia spedizione gratuita). */
  unitAmountCents: number;
};

export const STRIPE_CATALOG: Record<string, StripeCatalogEntry> = {
  "mundo-gin": {
    stripePriceId: "price_1Q8IXoFVc589tw39TSZLFojV",
    unitAmountCents: 4500,
  },
  "gift-pack": {
    stripePriceId: "price_1QxUEAFVc589tw39c9DacWps",
    unitAmountCents: 400,
  },
  "recoaro-x6": {
    stripePriceId: "price_1TQvsZFVc589tw39IjxHw7JN",
    unitAmountCents: 450,
  },
  "mundo-beer-6": {
    stripePriceId: "price_1TqxWYFVc589tw39lh5e5DBz",
    unitAmountCents: 2400,
  },
  "mundo-beer-9": {
    stripePriceId: "price_1TtREJFVc589tw39eBphRCyc",
    unitAmountCents: 3600,
  },
  "mundo-beer-24": {
    stripePriceId: "price_1TqxX2FVc589tw39IgB9RfcV",
    unitAmountCents: 9600,
  },
};

/** Soglia per spedizione gratuita (50,00 €). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
