import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  FREE_SHIPPING_THRESHOLD_CENTS,
  STRIPE_CATALOG,
} from "@/lib/stripe-catalog";

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
  const origin = siteOrigin();
  let subtotalCents = 0;

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
    subtotalCents += entry.unitAmountCents * quantity;
    lineItems.push({
      quantity,
      price: entry.stripePriceId,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Nessuna riga valida." }, { status: 400 });
  }

  const shippingEnv = process.env.STRIPE_SHIPPING_FIXED_AMOUNT_CENTS?.trim();
  const shippingParsed = shippingEnv
    ? Number.parseInt(shippingEnv, 10)
    : 700;
  const paidShippingCents =
    Number.isFinite(shippingParsed) && shippingParsed >= 0
      ? shippingParsed
      : 700;

  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              display_name: "Spedizione gratuita (da €50)",
              fixed_amount: { amount: 0, currency: "eur" },
            },
          },
        ]
      : [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              display_name:
                "Spedizione standard (1-3 giorni lavorativi)\nGratuita sopra i 50,00 €",
              fixed_amount: { amount: paidShippingCents, currency: "eur" },
            },
          },
        ];

  const stripe = new Stripe(secret);
  const base = origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "it",
      line_items: lineItems,
      allow_promotion_codes: true,
      shipping_options: shippingOptions,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["IT"],
      },
      custom_fields: [
        {
          key: "codice_fiscale",
          label: {
            type: "custom",
            custom: "Codice fiscale",
          },
          type: "text",
          optional: false,
          text: {
            maximum_length: 16,
          },
        },
      ],
      custom_text: {
        shipping_address: {
          message:
            "Inserisci i dati della persona che ricevera il pacco. Il corriere puo richiedere un documento valido per la consegna.",
        },
      },
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
    if (e instanceof Stripe.errors.StripeError) {
      if (e.code === "resource_missing") {
        return NextResponse.json(
          {
            error:
              "Prezzi Stripe non trovati: verifica che chiave e Price ID siano nello stesso ambiente (test o live).",
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { error: "Errore durante la creazione del pagamento. Riprova." },
      { status: 500 }
    );
  }
}
