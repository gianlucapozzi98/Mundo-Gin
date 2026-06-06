import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { STRIPE_CATALOG } from "@/lib/stripe-catalog";

const PRICE_TO_PRODUCT = Object.fromEntries(
  Object.entries(STRIPE_CATALOG).map(([productId, entry]) => [
    entry.stripePriceId,
    productId,
  ]),
);

export async function GET(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Pagamenti non configurati." },
      { status: 503 },
    );
  }

  const sessionId = req.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { ok: false, error: "Sessione non valida." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, error: "Pagamento non completato." },
        { status: 400 },
      );
    }

    const lineItems = session.line_items?.data ?? [];
    const contents: { id: string; quantity: number }[] = [];
    const contentIds: string[] = [];

    for (const item of lineItems) {
      const priceId =
        typeof item.price === "string" ? item.price : item.price?.id;
      if (!priceId) continue;

      const productId = PRICE_TO_PRODUCT[priceId] ?? priceId;
      const quantity = item.quantity ?? 1;

      contentIds.push(productId);
      contents.push({ id: productId, quantity });
    }

    const numItems = contents.reduce((sum, line) => sum + line.quantity, 0);
    const currency = (session.currency ?? "eur").toUpperCase();
    const value = (session.amount_total ?? 0) / 100;

    return NextResponse.json({
      ok: true,
      value,
      currency,
      content_ids: contentIds,
      contents,
      num_items: numItems,
    });
  } catch (error) {
    console.error("Stripe session retrieve:", error);
    return NextResponse.json(
      { ok: false, error: "Sessione non trovata." },
      { status: 404 },
    );
  }
}
