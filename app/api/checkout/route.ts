import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_CATALOG } from "@/lib/stripe-catalog";

function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "https://mundogin.com";
}

type BodyItem = { productId?: string; qty?: number };

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Pagamenti non ancora configurati sul server." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const rawItems = (body as { items?: unknown }).items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: "Carrello vuoto." }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;
    const { productId, qty } = raw as BodyItem;
    if (typeof productId !== "string" || typeof qty !== "number") continue;
    const entry = STRIPE_CATALOG[productId];
    if (!entry) {
      return NextResponse.json(
        { error: "Uno o più prodotti non sono disponibili al checkout." },
        { status: 400 }
      );
    }
    const quantity = Math.min(99, Math.max(1, Math.floor(qty)));
    lineItems.push({
      quantity,
      price_data: {
        currency: "eur",
        unit_amount: entry.unitAmountCents,
        product_data: { name: entry.name },
      },
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Nessuna riga valida." }, { status: 400 });
  }

  const stripe = new Stripe(secret);
  const base = siteOrigin();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      line_items: lineItems,
      success_url: `${base}/ordine-ricevuto?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/carrello`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Impossibile avviare il pagamento." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout:", e);
    return NextResponse.json(
      { error: "Errore durante la creazione del pagamento. Riprova." },
      { status: 500 }
    );
  }
}
