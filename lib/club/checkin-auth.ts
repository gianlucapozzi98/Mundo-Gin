import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type ClubStaffRole = "scanner" | "admin";

const COOKIE_NAME = "mundo_club_checkin";
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function getScannerPassword() {
  return process.env.CLUB_SCAN_PASSWORD?.trim() || "scanner";
}

function getAdminPassword() {
  return process.env.CLUB_ADMIN_PASSWORD?.trim() || "mundo1998";
}

function getSecret() {
  return (
    process.env.CLUB_CHECKIN_SECRET?.trim() ||
    process.env.CLUB_ADMIN_PASSWORD?.trim() ||
    "mundo-club-dev-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function matchesPassword(input: string, expected: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // dummy compare to keep timing closer
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

/** Ritorna il ruolo se la password è valida, altrimenti null. */
export function resolveStaffRole(password: string): ClubStaffRole | null {
  if (matchesPassword(password, getAdminPassword())) return "admin";
  if (matchesPassword(password, getScannerPassword())) return "scanner";
  return null;
}

export function createStaffSessionToken(role: ClubStaffRole) {
  const issuedAt = Date.now().toString();
  const payload = `${role}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function parseStaffSessionToken(
  token: string | undefined
): { role: ClubStaffRole; issuedAt: number } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [role, issuedAt, signature] = parts;
  if (role !== "admin" && role !== "scanner") return null;
  if (!issuedAt || !signature) return null;

  const payload = `${role}.${issuedAt}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > COOKIE_MAX_AGE * 1000) {
    return null;
  }

  return { role, issuedAt: Number(issuedAt) };
}

export async function getStaffSession() {
  const jar = await cookies();
  return parseStaffSessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function isStaffAuthenticated(
  minRole: ClubStaffRole = "scanner"
) {
  const session = await getStaffSession();
  if (!session) return false;
  if (minRole === "scanner") return true;
  return session.role === "admin";
}

export function getStaffCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

export function getClearStaffCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
