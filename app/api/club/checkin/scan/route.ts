import { NextRequest, NextResponse } from "next/server";
import { isCheckinAuthenticated } from "@/lib/club/checkin-auth";
import { checkInByToken } from "@/lib/club/registrations";

export async function POST(req: NextRequest) {
  if (!(await isCheckinAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  let body: { token?: string };
  try {
    body = (await req.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ error: "Token mancante." }, { status: 400 });
  }

  try {
    const result = await checkInByToken(token);

    if (result.status === "not_found") {
      return NextResponse.json(
        { status: "not_found", error: "QR non valido." },
        { status: 404 }
      );
    }

    const registration = result.registration;
    return NextResponse.json({
      status: result.status,
      registration: {
        firstName: registration.firstName,
        lastName: registration.lastName,
        promoterName: registration.promoterName,
        qrToken: registration.qrToken,
        checkedInAt: registration.checkedInAt,
        eventSlug: registration.eventSlug,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Errore durante il check-in." },
      { status: 500 }
    );
  }
}
