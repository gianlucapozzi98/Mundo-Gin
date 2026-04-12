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

/** Carto Voyager: strade, verde, acqua — più dettaglio e colore (2D, senza effetti 3D) */
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

let markerIconSingleton: L.DivIcon | null = null;

/** Punta del pin = vertice basso (18,40) = coordinate geografiche. */
function getMarkerIcon(): L.DivIcon {
  if (markerIconSingleton) return markerIconSingleton;
  const pinSvg = `<svg class="mundo-marker-pin__svg" width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="18" cy="42" rx="6" ry="2" fill="rgba(0,0,0,0.12)"/>
    <path d="M18 2C10.28 2 4 8.05 4 15.5 4 24 18 40 18 40S32 24 32 15.5C32 8.05 25.72 2 18 2z" fill="#141414" stroke="#b8955c" stroke-width="1.1"/>
    <circle cx="18" cy="15" r="4" fill="#f7f4ef" stroke="#b8955c" stroke-width="0.65"/>
    <circle cx="18" cy="15" r="1.65" fill="#b8955c"/>
  </svg>`;
  markerIconSingleton = L.divIcon({
    className: "mundo-marker",
    html: `<div class="mundo-marker-pin">${pinSvg}</div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 40],
    popupAnchor: [0, -44],
  });
  return markerIconSingleton;
}

function SingleMarker({ loc }: { loc: Location }) {
  return (
    <Marker position={[loc.lat, loc.lng]} icon={getMarkerIcon()} riseOnHover>
      <Popup
        className="mundo-popup"
        maxWidth={320}
        minWidth={240}
        autoPan
        keepInView
        autoPanPadding={[72, 72]}
      >
        <div className="mundo-popup-card">
          <p className="font-futura-500 font-medium text-mundo-black mb-1 text-[17px] leading-tight">
            {loc.name}
          </p>
          <p className="font-futura-400 text-[14px] text-mundo-black/75 mb-3 leading-snug">
            {loc.address}
            <br />
            {loc.city}
            {loc.cap ? `, ${loc.cap}` : ""}
            {loc.province ? ` (${loc.province})` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {loc.instagramUrl ? (
              <a
                href={loc.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mundo-popup-btn mundo-popup-btn--ghost mundo-popup-btn--icon-only"
                aria-label="Apri Instagram del locale"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[1.15rem] w-[1.15rem] shrink-0" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            ) : null}
            {loc.mapUrl ? (
              <a
                href={loc.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mundo-popup-btn mundo-popup-btn--solid"
              >
                Indicazioni
              </a>
            ) : null}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

/** Leaflet spesso monta con dimensione 0 (layout / dynamic import): forza ricalcolo tiles. */
function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    const fix = () => {
      map.invalidateSize({ animate: false });
    };
    fix();
    const t0 = window.setTimeout(fix, 50);
    const t1 = window.setTimeout(fix, 250);
    const onResize = () => fix();
    window.addEventListener("resize", onResize);
    const el = map.getContainer().parentElement;
    const ro =
      el && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => fix())
        : null;
    if (el) ro?.observe(el);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [map]);
  return null;
}

function FitBoundsToMarkers({ locations }: { locations: Location[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (locations.length === 0 || fitted.current) return;

    const id = window.requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
      if (locations.length === 1) {
        map.flyTo([locations[0].lat, locations[0].lng], 14, { duration: 1.1 });
      } else {
        const bounds = L.latLngBounds(
          locations.map((loc) => [loc.lat, loc.lng] as [number, number])
        );
        map.flyToBounds(bounds, {
          padding: [52, 52],
          maxZoom: 11,
          duration: 1.35,
        });
      }
      fitted.current = true;
    });
    return () => window.cancelAnimationFrame(id);
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
              ? "map-shell relative w-full min-h-[300px] overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06]"
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
            <MapContainer
              center={ITALY_CENTER}
              zoom={ITALY_ZOOM}
              className="z-0 h-full w-full [&_.leaflet-tile-pane]:opacity-100"
              scrollWheelZoom
              zoomControl
              style={{
                height: "100%",
                minHeight: compact ? 300 : 420,
                width: "100%",
              }}
              maxBounds={ITALY_BOUNDS}
              maxBoundsViscosity={1}
              minZoom={5}
              maxZoom={16}
            >
              <TileLayer
                attribution={TILE_ATTRIBUTION}
                url={TILE_URL}
                subdomains="abcd"
              />
              <InvalidateMapSize />
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
