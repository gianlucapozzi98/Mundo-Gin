"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setCart } from "@/lib/cart";
import { trackPurchase } from "@/lib/meta-pixel";

const TRACKED_KEY_PREFIX = "mundo-meta-purchase-";

export function PurchaseTracker() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    const storageKey = `${TRACKED_KEY_PREFIX}${sessionId}`;
    if (sessionStorage.getItem(storageKey)) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json()) as {
          ok?: boolean;
          value?: number;
          currency?: string;
          content_ids?: string[];
          contents?: { id: string; quantity: number }[];
          num_items?: number;
        };

        if (
          !res.ok ||
          !data.ok ||
          data.value == null ||
          !data.currency ||
          !data.content_ids ||
          !data.contents ||
          data.num_items == null
        ) {
          return;
        }

        trackPurchase({
          value: data.value,
          currency: data.currency,
          content_ids: data.content_ids,
          contents: data.contents,
          num_items: data.num_items,
        });
        sessionStorage.setItem(storageKey, "1");
        setCart([]);
      } catch {
        // Pixel opzionale: non bloccare la pagina di conferma.
      }
    })();
  }, [sessionId]);

  return null;
}
