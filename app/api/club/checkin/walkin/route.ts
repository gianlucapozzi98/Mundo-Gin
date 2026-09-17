import { NextRequest, NextResponse } from "next/server";
import { getRegisterableEvent } from "@/lib/club/catalog";
import { canScanCheckin } from "@/lib/club/checkin-auth";
import {
  createRegistration,
  setPresentById,
} from "@/lib/club/registrations";

export async function POST(req: NextRequest) {
  if (!(await canScanCheckin())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let body: {
    eventSlug?: string;
    firstName?: string;
    lastName?: string;
    promoterCode?: string | null;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const eventSlug = body.eventSlug?.trim() || "mundo-castle";
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

  try {
    const created = await createRegistration({
      eventSlug,
      firstName,
      lastName,
      promoterCode,
    });

    const updated = await setPresentById(created.id, true);
    const registration = updated ?? { ...created, present: true };

    return NextResponse.json({
      ok: true,
      status: "ok" as const,
      registration: {
        id: registration.id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        promoterName: registration.promoterName,
        present: registration.present,
        checkedInAt: registration.checkedInAt,
        qrToken: registration.qrToken,
      },
    });
  } catch (error) {
    console.error("Check-in walk-in error:", error);
    return NextResponse.json(
      { error: "Impossibile aggiungere l'iscritto." },
      { status: 500 }
    );
  }
}
