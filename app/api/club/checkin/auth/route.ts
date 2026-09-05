import { NextRequest, NextResponse } from "next/server";
import {
  createCheckinSessionToken,
  getCheckinCookieOptions,
  getClearCheckinCookieOptions,
  isCheckinAuthenticated,
  verifyCheckinPassword,
} from "@/lib/club/checkin-auth";

export async function GET() {
  const authenticated = await isCheckinAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  let body: { password?: string; action?: string };
  try {
    body = (await req.json()) as { password?: string; action?: string };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  if (body.action === "logout") {
    const res = NextResponse.json({ ok: true, authenticated: false });
    const clear = getClearCheckinCookieOptions();
    res.cookies.set(clear.name, clear.value, clear);
    return res;
  }

  if (!body.password || !verifyCheckinPassword(body.password)) {
    return NextResponse.json(
      { error: "Password non corretta." },
      { status: 401 }
    );
  }

  const token = createCheckinSessionToken();
  const cookie = getCheckinCookieOptions(token);
  const res = NextResponse.json({ ok: true, authenticated: true });
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
