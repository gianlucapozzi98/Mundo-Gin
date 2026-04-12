/** Prezzi ufficiali lato server (non fidarsi del client). Importi in centesimi. */
export const STRIPE_CATALOG: Record<
  string,
  { name: string; unitAmountCents: number }
> = {
  "mundo-gin": { name: "MUNDO GIN (70 cl)", unitAmountCents: 4500 },
  "gift-pack": { name: "Gift Pack", unitAmountCents: 400 },
  "recoaro-x6": {
    name: "Acqua Brillante Recoaro x6",
    unitAmountCents: 450,
  },
};
