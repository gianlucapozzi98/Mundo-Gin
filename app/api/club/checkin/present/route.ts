import { NextRequest, NextResponse } from "next/server";
import { canScanCheckin } from "@/lib/club/checkin-auth";
import {
  getRegistrationById,
  setPresentById,
} from "@/lib/club/registrations";

export async function POST(req: NextRequest) {
  if (!(await canScanCheckin())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = (await req.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Dati mancanti." }, { status: 400 });
  }

  try {
    const existing = await getRegistrationById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Registrazione non trovata." },
        { status: 404 }
      );
    }

    if (existing.present) {
      return NextResponse.json({
        ok: true,
        status: "already" as const,
        registration: {
          id: existing.id,
          firstName: existing.firstName,
          lastName: existing.lastName,
          promoterName: existing.promoterName,
          present: existing.present,
          checkedInAt: existing.checkedInAt,
          qrToken: existing.qrToken,
        },
      });
    }

    const updated = await setPresentById(id, true);
    if (!updated) {
      return NextResponse.json(
        { error: "Registrazione non trovata." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "ok" as const,
      registration: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        promoterName: updated.promoterName,
        present: updated.present,
        checkedInAt: updated.checkedInAt,
        qrToken: updated.qrToken,
      },
    });
  } catch (error) {
    console.error("Check-in present error:", error);
    return NextResponse.json(
      { error: "Impossibile segnare la presenza." },
      { status: 500 }
    );
  }
}
