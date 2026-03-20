"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Location } from "./locations";

/* Italia: confine approssimativo (non si può uscire dalla mappa) */
const ITALY_BOUNDS = L.latLngBounds(
  [35.5, 6.5],   // Sud-Ovest
  [47.2, 18.8]   // Nord-Est
);
const ITALY_CENTER: [number, number] = [42.8, 12.5];
const ITALY_ZOOM = 6;

function createMarkerIcon() {
  return L.divIcon({
    className: "mundo-marker",
    html: `<span class="mundo-marker-dot"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function SingleMarker({ loc }: { loc: Location }) {
  return (
    <Marker position={[loc.lat, loc.lng]} icon={createMarkerIcon()}>
      <Popup className="mundo-popup">
        <div className="min-w-[180px]">
          <p className="font-futura-500 font-medium text-mundo-black mb-1.5 text-base">
            {loc.name}
          </p>
          <p className="text-sm text-mundo-black/80 mb-2 leading-snug">
            {loc.address}
            <br />
            {loc.city}
            {loc.cap ? `, ${loc.cap}` : ""}
            {loc.province ? ` (${loc.province})` : ""}
          </p>
          {loc.instagramUrl && (
            <a
              href={loc.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mb-2 text-mundo-black/80 hover:text-mundo-black"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          )}
          {loc.mapUrl && (
            <a
              href={loc.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-mundo-black font-futura-500 font-medium text-xs uppercase tracking-wider hover:underline"
            >
              Indicazioni
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function FitBoundsToMarkers({ locations }: { locations: Location[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (locations.length === 0) return;
    if (fitted.current) return;
    fitted.current = true;

    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 14);
      return;
    }

    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.lat, loc.lng] as [number, number])
    );
    map.fitBounds(bounds, {
      padding: [32, 32],
      maxZoom: 11,
    });
  }, [map, locations]);

  return null;
}

type Props = { locations: Location[]; compact?: boolean };

export function MapSection({ locations, compact = false }: Props) {
  return (
    <section
      className={
        compact
          ? "py-0"
          : "py-16 sm:py-20 lg:py-24 bg-mundo-cream"
      }
    >
      <div
        className={
          compact
            ? "w-full h-full min-h-[280px]"
            : "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        }
      >
        {!compact && (
          <>
            <h2 className="text-mundo-black font-futura-500 font-medium text-2xl sm:text-3xl mb-2">
              Mappa
            </h2>
            <p className="font-futura-400 text-mundo-black/70 text-[18px] mb-8">
              Clicca sui pallini per il locale e le indicazioni.
            </p>
          </>
        )}
        <div
          className={
            compact
              ? "rounded-xl overflow-hidden w-full h-full min-h-[280px] shadow-lg ring-1 ring-black/5"
              : "rounded-xl overflow-hidden border border-mundo-black/10 bg-mundo-white shadow-xl"
          }
        >
          <div
            className={
              compact
                ? "w-full h-[280px]"
                : "aspect-[16/10] min-h-[400px] w-full relative"
            }
          >
            <MapContainer
              center={ITALY_CENTER}
              zoom={ITALY_ZOOM}
              className="h-full w-full"
              scrollWheelZoom={true}
              style={{ minHeight: compact ? 280 : 400 }}
              maxBounds={ITALY_BOUNDS}
              maxBoundsViscosity={1}
              minZoom={5}
              maxZoom={14}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {locations.map((loc) => (
                <SingleMarker key={loc.id} loc={loc} />
              ))}
              <FitBoundsToMarkers locations={locations} />
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
