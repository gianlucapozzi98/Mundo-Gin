import { NextRequest, NextResponse } from "next/server";
import { getRegisterableEvent } from "@/lib/club/catalog";
import { isStaffAuthenticated } from "@/lib/club/checkin-auth";
import {
  getEventStats,
  listRegistrationsByEvent,
  setPresentById,
} from "@/lib/club/registrations";

export async function GET(req: NextRequest) {
  if (!(await isStaffAuthenticated("admin"))) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const eventSlug =
    req.nextUrl.searchParams.get("event")?.trim() || "mundo-castel";

  if (!getRegisterableEvent(eventSlug)) {
    return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
  }

  try {
    const [registrations, stats] = await Promise.all([
      listRegistrationsByEvent(eventSlug),
      getEventStats(eventSlug),
    ]);

    return NextResponse.json({
      ok: true,
      registrations: registrations.map((r) => ({
        id: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        promoterName: r.promoterName,
        promoterCode: r.promoterCode,
        qrToken: r.qrToken,
        present: r.present,
        checkedInAt: r.checkedInAt,
        createdAt: r.createdAt,
      })),
      stats,
    });
  } catch (error) {
    console.error("Admin list error:", error);
    return NextResponse.json(
      { error: "Impossibile caricare le registrazioni." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isStaffAuthenticated("admin"))) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let body: { id?: string; present?: boolean };
  try {
    body = (await req.json()) as { id?: string; present?: boolean };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (!body.id || typeof body.present !== "boolean") {
    return NextResponse.json({ error: "Dati mancanti." }, { status: 400 });
  }

  const updated = await setPresentById(body.id, body.present);
  if (!updated) {
    return NextResponse.json(
      { error: "Registrazione non trovata." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    registration: {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      promoterName: updated.promoterName,
      promoterCode: updated.promoterCode,
      qrToken: updated.qrToken,
      present: updated.present,
      checkedInAt: updated.checkedInAt,
      createdAt: updated.createdAt,
    },
  });
}
