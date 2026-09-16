import { NextRequest, NextResponse } from "next/server";
import { getRegisterableEvent } from "@/lib/club/catalog";
import { canScanCheckin } from "@/lib/club/checkin-auth";
import { listRegistrationsByEvent } from "@/lib/club/registrations";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function GET(req: NextRequest) {
  if (!(await canScanCheckin())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const eventSlug =
    req.nextUrl.searchParams.get("event")?.trim() || "mundo-castle";
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!getRegisterableEvent(eventSlug)) {
    return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
  }

  if (q.length < 2) {
    return NextResponse.json({
      ok: true,
      registrations: [],
      message: "Digita almeno 2 caratteri.",
    });
  }

  try {
    const rows = await listRegistrationsByEvent(eventSlug);
    const needle = normalize(q);
    const matches = rows
      .filter((row) => {
        const full = normalize(`${row.firstName} ${row.lastName}`);
        const reverse = normalize(`${row.lastName} ${row.firstName}`);
        return (
          full.includes(needle) ||
          reverse.includes(needle) ||
          normalize(row.firstName).includes(needle) ||
          normalize(row.lastName).includes(needle)
        );
      })
      .slice(0, 20)
      .map((r) => ({
        id: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        promoterName: r.promoterName,
        present: r.present,
        checkedInAt: r.checkedInAt,
        qrToken: r.qrToken,
      }));

    return NextResponse.json({ ok: true, registrations: matches });
  } catch (error) {
    console.error("Check-in search error:", error);
    return NextResponse.json(
      { error: "Impossibile cercare le registrazioni." },
      { status: 500 }
    );
  }
}
