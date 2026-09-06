import { NextRequest, NextResponse } from "next/server";
import {
  createStaffSessionToken,
  getClearStaffCookieOptions,
  getStaffCookieOptions,
  getStaffSession,
  resolveStaffLogin,
} from "@/lib/club/checkin-auth";

export async function GET() {
  const session = await getStaffSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    role: session?.role ?? null,
    promoterCode: session?.promoterCode ?? null,
    promoterName: session?.promoterName ?? null,
  });
}

export async function POST(req: NextRequest) {
  let body: {
    password?: string;
    action?: string;
    /** "adminPanel" = admin o PR; "admin" = solo admin pieno */
    requiredRole?: "admin" | "adminPanel" | "scanner";
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (body.action === "logout") {
    const res = NextResponse.json({
      ok: true,
      authenticated: false,
      role: null,
      promoterCode: null,
      promoterName: null,
    });
    const clear = getClearStaffCookieOptions();
    res.cookies.set(clear.name, clear.value, clear);
    return res;
  }

  const login = body.password ? resolveStaffLogin(body.password) : null;
  if (!login) {
    return NextResponse.json(
      { error: "Password non corretta." },
      { status: 401 }
    );
  }

  if (body.requiredRole === "admin" && login.role !== "admin") {
    return NextResponse.json(
      {
        error:
          "Questa area è riservata agli admin. Usa /club/checkin per lo scan.",
      },
      { status: 403 }
    );
  }

  if (body.requiredRole === "adminPanel") {
    if (login.role !== "admin" && login.role !== "promoter") {
      return NextResponse.json(
        {
          error:
            "Accesso non valido. Gli scanner usano /club/checkin.",
        },
        { status: 403 }
      );
    }
  }

  const token = createStaffSessionToken(login);
  const cookie = getStaffCookieOptions(token);
  const res = NextResponse.json({
    ok: true,
    authenticated: true,
    role: login.role,
    promoterCode: login.promoterCode,
    promoterName: login.promoterName,
  });
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
