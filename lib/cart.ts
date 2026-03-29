export const CART_STORAGE_KEY = "mundo-cart";

export type CartLine = {
  productId: string;
  name: string;
  subtitle?: string;
  priceEur: number;
  qty: number;
  image: string;
};

function dispatchCartUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("mundo-cart-updated"));
}

export function getCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function setCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  dispatchCartUpdated();
}

export function addToCart(
  line: Omit<CartLine, "qty"> & { qty: number }
): void {
  const cart = getCart();
  const idx = cart.findIndex((l) => l.productId === line.productId);
  if (idx >= 0) {
    cart[idx] = {
      ...cart[idx],
      qty: cart[idx].qty + line.qty,
    };
  } else {
    cart.push({ ...line, qty: line.qty });
  }
  setCart(cart);
}

export function removeFromCart(productId: string): void {
  setCart(getCart().filter((l) => l.productId !== productId));
}

export function formatEur(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
