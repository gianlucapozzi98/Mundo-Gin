export const MUNDO_BEER_IMAGE = "/images/Mundo-Beer-Front.png";

export const MUNDO_BEER_IMAGE_BACK = "/images/Mundo-Beer-back.png";

export const MUNDO_BEER_PRODUCT_IMAGES = [
  MUNDO_BEER_IMAGE,
  MUNDO_BEER_IMAGE_BACK,
] as const;

export const MUNDO_BEER_NAME = "MUNDO BEER";

export const MUNDO_BEER_SUBTITLE = "Pilsner";

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
    priceEur: 24,
    priceDisplay: "€24.00",
  },
  {
    id: "mundo-beer-9",
    label: "9 lattine",
    pieces: 9,
    priceEur: 36,
    priceDisplay: "€36.00",
  },
  {
    id: "mundo-beer-24",
    label: "24 lattine",
    pieces: 24,
    priceEur: 96,
    priceDisplay: "€96.00",
  },
];

export const MUNDO_BEER_FROM_PRICE_DISPLAY = "€24.00";

export function getBeerVariant(productId: string) {
  return MUNDO_BEER_VARIANTS.find((variant) => variant.id === productId);
}

export function isBeerProductId(productId: string) {
  return productId.startsWith("mundo-beer-");
}
