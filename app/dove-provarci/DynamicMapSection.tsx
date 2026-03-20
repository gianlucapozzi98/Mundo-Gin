"use client";

import dynamic from "next/dynamic";
import type { Location } from "./locations";

const MapSection = dynamic(() => import("./MapSection").then((m) => m.MapSection), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/10] min-h-[400px] rounded-xl bg-mundo-black/5 flex items-center justify-center">
      <p className="font-futura-400 text-mundo-black/60">Caricamento mappa...</p>
    </div>
  ),
});

export function DynamicMapSection({
  locations,
  compact,
}: {
  locations: Location[];
  compact?: boolean;
}) {
  return <MapSection locations={locations} compact={compact} />;
}
