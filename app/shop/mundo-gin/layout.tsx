import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import {
  MUNDO_GIN_CARD_IMAGE,
  MUNDO_GIN_PRICE_EUR,
  MUNDO_GIN_PRODUCT_ID,
} from "@/lib/mundo-gin-product";
import {
  absoluteUrl,
  brandJsonLd,
  pageMetadata,
  sellerJsonLd,
} from "@/lib/seo";

const PATH = "/shop/mundo-gin";
const DESCRIPTION =
  "Compra Mundo Gin: London Dry italiano distillato con caffè. Bottiglia 70 cl, gusto unico. Ordina online.";

export const metadata: Metadata = pageMetadata({
  title: "Mundo Gin | Italian Coffee Dry Gin in vendita",
  description: DESCRIPTION,
  path: PATH,
  image: {
    url: MUNDO_GIN_CARD_IMAGE,
    alt: "Bottiglia di Mundo Gin, Italian Coffee Dry Gin",
  },
});

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${absoluteUrl(PATH)}#product`,
  name: "Mundo Gin – Italian Coffee Dry Gin 70 cl",
  description:
    "London Dry gin italiano distillato con caffè specialty. Note di cioccolato fondente, mandorla e frutti di bosco. 40% vol, bottiglia da 70 cl.",
  sku: MUNDO_GIN_PRODUCT_ID,
  category: "Gin",
  brand: brandJsonLd,
  image: [
    absoluteUrl(MUNDO_GIN_CARD_IMAGE),
    absoluteUrl("/images/bottiglia-mundo-gin- caffe-pack.png"),
  ],
  countryOfOrigin: { "@type": "Country", name: "Italia" },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Distillazione", value: "London Dry" },
    { "@type": "PropertyValue", name: "Gradazione", value: "40% vol" },
    { "@type": "PropertyValue", name: "Formato", value: "70 cl" },
    { "@type": "PropertyValue", name: "Colore", value: "Cristallino" },
  ],
  offers: {
    "@type": "Offer",
    url: absoluteUrl(PATH),
    price: MUNDO_GIN_PRICE_EUR.toFixed(2),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: sellerJsonLd,
  },
};

export default function MundoGinProductLayout({
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
