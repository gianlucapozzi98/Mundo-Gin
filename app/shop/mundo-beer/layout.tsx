import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import {
  MUNDO_BEER_IMAGE,
  MUNDO_BEER_IMAGE_BACK,
  MUNDO_BEER_VARIANTS,
} from "@/lib/mundo-beer-product";
import {
  absoluteUrl,
  brandJsonLd,
  pageMetadata,
  sellerJsonLd,
} from "@/lib/seo";

const PATH = "/shop/mundo-beer";

export const metadata: Metadata = pageMetadata({
  title: "Mundo Beer | Birra Pilsner in lattina, acquista online",
  description:
    "Mundo Beer: birra Pilsner 5% vol in lattina da 33 cl, non pastorizzata e non filtrata. Confezioni da 6, 9 e 24 lattine. Ordina online.",
  path: PATH,
  image: { url: MUNDO_BEER_IMAGE, alt: "Lattina di Mundo Beer, birra Pilsner" },
});

const prices = MUNDO_BEER_VARIANTS.map((variant) => variant.priceEur);

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${absoluteUrl(PATH)}#product`,
  name: "Mundo Beer – Pilsner in lattina 33 cl",
  description:
    "Birra Pilsner bionda dorata, 5% vol, dal gusto erbaceo con delicate note maltate. Non pastorizzata e non filtrata, senza aggiunta di conservanti.",
  category: "Birra",
  brand: brandJsonLd,
  image: [absoluteUrl(MUNDO_BEER_IMAGE), absoluteUrl(MUNDO_BEER_IMAGE_BACK)],
  additionalProperty: [
    { "@type": "PropertyValue", name: "Stile", value: "Pilsner" },
    { "@type": "PropertyValue", name: "Gradazione", value: "5% vol" },
    { "@type": "PropertyValue", name: "Formato", value: "Lattina 33 cl" },
  ],
  offers: {
    "@type": "AggregateOffer",
    url: absoluteUrl(PATH),
    priceCurrency: "EUR",
    lowPrice: Math.min(...prices).toFixed(2),
    highPrice: Math.max(...prices).toFixed(2),
    offerCount: MUNDO_BEER_VARIANTS.length,
    availability: "https://schema.org/InStock",
    seller: sellerJsonLd,
    offers: MUNDO_BEER_VARIANTS.map((variant) => ({
      "@type": "Offer",
      name: `Mundo Beer – ${variant.label}`,
      sku: variant.id,
      url: absoluteUrl(PATH),
      price: variant.priceEur.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    })),
  },
};

export default function MundoBeerProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={productJsonLd} />
      {children}
    </>
  );
}
