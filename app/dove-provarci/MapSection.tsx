"use client";

import { useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  useMap,
} from "@/components/ui/mapcn-marker-popup";
import { LOCATION_IMAGE_MAP } from "./location-images";
import type { Location } from "./locations";

const ITALY_CENTER: [number, number] = [12.5, 42.8];
const ITALY_ZOOM = 6;
const ITALY_MAX_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 35.5],
  [18.8, 47.2],
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function formatLocationAddress(loc: Location) {
  const cityLine = `${loc.city}${loc.cap ? `, ${loc.cap}` : ""}${loc.province ? ` (${loc.province})` : ""}`;
  return { cityLine };
}

function FitBoundsToMarkers({ locations }: { locations: Location[] }) {
  const { map, isLoaded } = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!map || !isLoaded || locations.length === 0 || fitted.current) return;

    fitted.current = true;

    if (locations.length === 1) {
      map.flyTo({
        center: [locations[0].lng, locations[0].lat],
        zoom: 14,
        duration: 1100,
      });
      return;
    }

    const lngs = locations.map((loc) => loc.lng);
    const lats = locations.map((loc) => loc.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 52, maxZoom: 11, duration: 1350 },
    );
  }, [map, isLoaded, locations]);

  return null;
}

function LocationMarker({ loc }: { loc: Location }) {
  const image = LOCATION_IMAGE_MAP[loc.name];
  const { cityLine } = formatLocationAddress(loc);

  return (
    <MapMarker longitude={loc.lng} latitude={loc.lat}>
      <MarkerContent>
        <div className="size-5 cursor-pointer rounded-full border-2 border-white bg-mundo-black shadow-lg transition-transform hover:scale-110" />
      </MarkerContent>
      <MarkerPopup className="w-[248px] p-0">
        {image ? (
          <div className="relative h-32 overflow-hidden rounded-t-md">
            <img
              src={image}
              alt={loc.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
        <div className="space-y-2 p-3">
          <h3 className="font-futura-500 text-[17px] leading-tight font-semibold text-mundo-black">
            {loc.name}
          </h3>
          <div className="flex items-start gap-1.5 text-sm text-mundo-black/70">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {loc.address}
              <br />
              {cityLine}
            </span>
          </div>
          <div className="flex gap-2 pt-1">
            {loc.mapUrl ? (
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-mundo-black px-3 text-sm font-medium text-mundo-white shadow-sm transition-colors hover:bg-mundo-black/90"
              >
                <Navigation className="size-3.5" />
                Indicazioni
              </a>
            ) : null}
            {loc.instagramUrl ? (
              <a
                href={loc.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram di ${loc.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-mundo-black/15 bg-mundo-white text-mundo-black shadow-sm transition-colors hover:bg-mundo-black/5"
              >
                <InstagramIcon className="size-3.5 shrink-0" />
              </a>
            ) : null}
          </div>
        </div>
      </MarkerPopup>
    </MapMarker>
  );
}

type Props = { locations: Location[]; compact?: boolean };

export function MapSection({ locations, compact = false }: Props) {
  return (
    <section className={compact ? "py-0" : "bg-mundo-cream py-16 sm:py-20 lg:py-24"}>
      <div
        className={
          compact
            ? "h-full min-h-[280px] w-full"
            : "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        }
      >
        {!compact && (
          <>
            <h2 className="mb-2 font-futura-500 text-2xl font-medium text-mundo-black sm:text-3xl">
              Mappa
            </h2>
            <p className="mb-8 font-futura-400 text-[18px] text-mundo-black/70">
              Clicca sui pallini per il locale e le indicazioni.
            </p>
          </>
        )}
        <div
          className={
            compact
              ? "map-shell relative min-h-[300px] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06]"
              : "map-shell relative overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.12)]"
          }
        >
          <div
            className={
              compact
                ? "relative h-[min(52vh,560px)] min-h-[300px] w-full sm:min-h-[380px]"
                : "relative aspect-[16/10] min-h-[420px] w-full sm:min-h-[480px]"
            }
          >
            <Map
              center={ITALY_CENTER}
              zoom={ITALY_ZOOM}
              minZoom={5}
              maxZoom={16}
              maxBounds={ITALY_MAX_BOUNDS}
              theme="light"
              className="h-full w-full"
            >
              {locations.map((loc) => (
                <LocationMarker key={loc.id} loc={loc} />
              ))}
              <FitBoundsToMarkers locations={locations} />
              <MapControls position="bottom-right" showZoom />
            </Map>
          </div>
        </div>
      </div>
    </section>
  );
}
