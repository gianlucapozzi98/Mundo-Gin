import type { Metadata } from "next";

export const SITE_URL = "https://www.mundogin.com";
export const SITE_NAME = "Mundo Gin";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/mundodrygin/";
export const FACEBOOK_PROFILE_URL =
  "https://www.facebook.com/people/Mundo-Gin/61558116593022/";

/** URL assoluto a partire da un path del sito (gestisce spazi nei nomi file). */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path canonico, es. "/shop/mundo-gin". */
  path: string;
  image?: { url: string; alt: string };
  noindex?: boolean;
};

/**
 * Metadata completi per una pagina: canonical, Open Graph e Twitter con
 * URL, titolo e descrizione propri (non quelli della home).
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex,
}: PageMetadataInput): Metadata {
  const ogImage = image
    ? [{ url: image.url, alt: image.alt }]
    : [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Mundo Gin — Italian Coffee Dry Gin",
        },
      ];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage.map((entry) => entry.url),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  legalName: "Mundo Gin S.N.C.",
  url: SITE_URL,
  logo: absoluteUrl("/icon-192.png"),
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  description:
    "Mundo Gin produce un Italian Coffee Dry Gin: London Dry italiano distillato con caffè specialty.",
  email: "info@mundogin.com",
  vatID: "IT04745890162",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Leonardo Da Vinci 37",
    postalCode: "24043",
    addressLocality: "Caravaggio",
    addressRegion: "BG",
    addressCountry: "IT",
  },
  sameAs: [INSTAGRAM_PROFILE_URL, FACEBOOK_PROFILE_URL],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "it-IT",
  publisher: { "@id": ORGANIZATION_ID },
};

export const brandJsonLd = { "@type": "Brand", name: SITE_NAME };
export const sellerJsonLd = { "@id": ORGANIZATION_ID };
