import { NextRequest, NextResponse } from "next/server";
import {
  createStaffSessionToken,
  getClearStaffCookieOptions,
  getStaffCookieOptions,
  getStaffSession,
  resolveStaffRole,
  type ClubStaffRole,
} from "@/lib/club/checkin-auth";

export async function GET() {
  const session = await getStaffSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    role: session?.role ?? null,
  });
}

export async function POST(req: NextRequest) {
  let body: { password?: string; action?: string; requiredRole?: ClubStaffRole };
  try {
    body = (await req.json()) as {
      password?: string;
      action?: string;
      requiredRole?: ClubStaffRole;
    };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (body.action === "logout") {
    const res = NextResponse.json({
      ok: true,
      authenticated: false,
      role: null,
    });
    const clear = getClearStaffCookieOptions();
    res.cookies.set(clear.name, clear.value, clear);
    return res;
  }

  const role = body.password ? resolveStaffRole(body.password) : null;
  if (!role) {
    return NextResponse.json(
      { error: "Password non corretta." },
      { status: 401 }
    );
  }

  if (body.requiredRole === "admin" && role !== "admin") {
    return NextResponse.json(
      {
        error:
          "Questa area è riservata agli admin. Usa /club/checkin per lo scan.",
      },
      { status: 403 }
    );
  }

  const token = createStaffSessionToken(role);
  const cookie = getStaffCookieOptions(token);
  const res = NextResponse.json({ ok: true, authenticated: true, role });
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
