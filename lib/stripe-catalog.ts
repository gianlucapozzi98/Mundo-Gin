/** Catalogo checkout lato server (non fidarsi del client). */
export type StripeCatalogEntry = {
  stripePriceId: string;
  /** Deve coincidere con l’importo del Price su Stripe (soglia spedizione gratuita). */
  unitAmountCents: number;
};

export const STRIPE_CATALOG: Record<string, StripeCatalogEntry> = {
  "mundo-gin": {
    stripePriceId: "price_1TQw5mFVc589tw39F4Y79lGZ",
    unitAmountCents: 4500,
  },
  "gift-pack": {
    stripePriceId: "price_1QxUEAFVc589tw39c9DacWps",
    unitAmountCents: 400,
  },
  "recoaro-x6": {
    stripePriceId: "price_1TQwBkFVc589tw39ndPd8gj1",
    unitAmountCents: 450,
  },
};

/** Soglia per spedizione gratuita (50,00 €). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
