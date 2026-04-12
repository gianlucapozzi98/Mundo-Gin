"use client";

import dynamic from "next/dynamic";
import type { Location } from "./locations";

const MapSection = dynamic(() => import("./MapSection").then((m) => m.MapSection), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[300px] h-[min(52vh,560px)] items-center justify-center rounded-2xl bg-gradient-to-br from-mundo-black/[0.04] to-mundo-black/[0.08] sm:min-h-[380px]"
      aria-busy="true"
      aria-label="Caricamento mappa"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full border-2 border-mundo-black/20 border-t-mundo-black/70" />
        <p className="font-futura-400 text-sm tracking-wide text-mundo-black/50">
          Caricamento mappa…
        </p>
      </div>
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
