import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mundo_club_checkin";
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function getPassword() {
  return process.env.CLUB_CHECKIN_PASSWORD?.trim() || "mundo-castel";
}

function getSecret() {
  return (
    process.env.CLUB_CHECKIN_SECRET?.trim() ||
    process.env.CLUB_CHECKIN_PASSWORD?.trim() ||
    "mundo-club-dev-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function verifyCheckinPassword(password: string) {
  const expected = getPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createCheckinSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidCheckinSessionToken(token: string | undefined) {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  const expected = sign(issuedAt);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age <= COOKIE_MAX_AGE * 1000;
}

export async function isCheckinAuthenticated() {
  const jar = await cookies();
  return isValidCheckinSessionToken(jar.get(COOKIE_NAME)?.value);
}

export function getCheckinCookieOptions(token: string) {
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

export function getClearCheckinCookieOptions() {
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
