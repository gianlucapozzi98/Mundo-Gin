type MetaPixelParams = Record<string, string | number | boolean | object>;

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom" | "init",
      eventOrId: string,
      params?: MetaPixelParams,
    ) => void;
  }
}

function track(event: string, params?: MetaPixelParams) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

export function trackViewCart(
  lines: { productId: string; priceEur: number; qty: number }[],
) {
  const contents = lines.map((line) => ({
    id: line.productId,
    quantity: line.qty,
  }));
  const numItems = contents.reduce((sum, line) => sum + line.quantity, 0);
  const value = lines.reduce(
    (sum, line) => sum + line.priceEur * line.qty,
    0,
  );

  track("ViewCart", {
    content_ids: lines.map((line) => line.productId),
    content_type: "product",
    contents,
    currency: "EUR",
    value,
    num_items: numItems,
  });
}

export function trackAddToCart(line: {
  productId: string;
  name: string;
  priceEur: number;
  qty: number;
}) {
  track("AddToCart", {
    content_ids: [line.productId],
    content_name: line.name,
    content_type: "product",
    contents: [{ id: line.productId, quantity: line.qty }],
    currency: "EUR",
    value: line.priceEur * line.qty,
    num_items: line.qty,
  });
}

export type PurchasePayload = {
  value: number;
  currency: string;
  content_ids: string[];
  contents: { id: string; quantity: number }[];
  num_items: number;
};

export function trackPurchase(payload: PurchasePayload) {
  track("Purchase", {
    value: payload.value,
    currency: payload.currency,
    content_ids: payload.content_ids,
    content_type: "product",
    contents: payload.contents,
    num_items: payload.num_items,
  });
}
