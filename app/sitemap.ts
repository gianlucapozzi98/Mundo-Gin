import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { CLUB_EVENTS } from "./club/events";

const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop/mundo-gin", priority: 0.9, changeFrequency: "weekly" },
  { path: "/shop/mundo-beer", priority: 0.9, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.8, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cocktail", priority: 0.7, changeFrequency: "monthly" },
  { path: "/dove-provarci", priority: 0.7, changeFrequency: "weekly" },
  { path: "/club", priority: 0.7, changeFrequency: "weekly" },
  { path: "/sostenibilita", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contatti", priority: 0.5, changeFrequency: "yearly" },
  { path: "/termini-e-condizioni", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Solo le pagine evento linkate pubblicamente da /club.
  const eventPaths = CLUB_EVENTS.map((event) => event.href).filter(
    (href): href is string => Boolean(href)
  );

  return [
    ...STATIC_PAGES.map(({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...[...new Set(eventPaths)].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
