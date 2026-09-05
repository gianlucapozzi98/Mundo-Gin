import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getRegisterableEvent } from "@/lib/club/catalog";
import {
  createRegistration,
  getRegistrationStorageMode,
} from "@/lib/club/registrations";

type Body = {
  eventSlug?: string;
  promoterCode?: string | null;
  firstName?: string;
  lastName?: string;
  privacyAccepted?: boolean;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const eventSlug = body.eventSlug?.trim() ?? "";
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const promoterCode = body.promoterCode?.trim() || null;

  if (!getRegisterableEvent(eventSlug)) {
    return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
  }

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Inserisci nome e cognome." },
      { status: 400 }
    );
  }

  if (!body.privacyAccepted) {
    return NextResponse.json(
      { error: "Devi accettare la Privacy Policy." },
      { status: 400 }
    );
  }

  try {
    const registration = await createRegistration({
      eventSlug,
      promoterCode,
      firstName,
      lastName,
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      req.nextUrl.origin;
    const qrPayload = `${origin}/club/checkin?token=${encodeURIComponent(registration.qrToken)}`;
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
      color: { dark: "#111111", light: "#ffffff" },
    });

    return NextResponse.json({
      ok: true,
      storage: getRegistrationStorageMode(),
      registration: {
        id: registration.id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        qrToken: registration.qrToken,
        promoterName: registration.promoterName,
        createdAt: registration.createdAt,
      },
      qrDataUrl,
    });
  } catch (error) {
    console.error("Event registration error:", error);
    return NextResponse.json(
      {
        error: "Impossibile completare la registrazione. Riprova.",
        storage: getRegistrationStorageMode(),
      },
      { status: 500 }
    );
  }
}
