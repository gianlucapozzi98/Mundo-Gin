export const MUNDO_BEER_IMAGE = "/images/Mundo Beer _ Front graphic.png";

export const MUNDO_BEER_NAME = "MUNDO BEER";

export const MUNDO_BEER_SUBTITLE = "Pre-ordine";

export type MundoBeerVariant = {
  id: string;
  label: string;
  pieces: number;
  priceEur: number;
  priceDisplay: string;
};

export const MUNDO_BEER_VARIANTS: MundoBeerVariant[] = [
  {
    id: "mundo-beer-6",
    label: "6 lattine",
    pieces: 6,
    priceEur: 21,
    priceDisplay: "€21.00",
  },
  {
    id: "mundo-beer-9",
    label: "9 lattine",
    pieces: 9,
    priceEur: 30,
    priceDisplay: "€30.00",
  },
  {
    id: "mundo-beer-24",
    label: "24 lattine",
    pieces: 24,
    priceEur: 75,
    priceDisplay: "€75.00",
  },
];

export const MUNDO_BEER_FROM_PRICE_DISPLAY = "€21.00";

export function getBeerVariant(productId: string) {
  return MUNDO_BEER_VARIANTS.find((variant) => variant.id === productId);
}

export function isBeerProductId(productId: string) {
  return productId.startsWith("mundo-beer-");
}
