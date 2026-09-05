import { NextRequest, NextResponse } from "next/server";
import { getRegisterableEvent } from "@/lib/club/catalog";
import { isStaffAuthenticated } from "@/lib/club/checkin-auth";
import { getEventStats } from "@/lib/club/registrations";

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
    const stats = await getEventStats(eventSlug);
    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Impossibile caricare le statistiche." },
      { status: 500 }
    );
  }
}
