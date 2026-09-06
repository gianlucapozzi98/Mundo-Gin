import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  listAllPromoters,
  promoterLoginPassword,
  type ClubPromoter,
} from "./catalog";

export type ClubStaffRole = "scanner" | "admin" | "promoter";

export type StaffSession = {
  role: ClubStaffRole;
  promoterCode: string | null;
  promoterName: string | null;
  issuedAt: number;
};

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
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export type ResolvedStaffLogin =
  | { role: "admin" | "scanner"; promoterCode: null; promoterName: null }
  | {
      role: "promoter";
      promoterCode: string;
      promoterName: string;
    };

function findPromoterByLoginPassword(password: string): ClubPromoter | null {
  for (const promoter of listAllPromoters()) {
    const expected =
      promoter.loginPassword?.trim().toLowerCase() ||
      promoterLoginPassword(promoter.name);
    if (matchesPassword(password, expected)) return promoter;
  }
  return null;
}

/** Risolve password → ruolo (admin / scanner / PR). */
export function resolveStaffLogin(password: string): ResolvedStaffLogin | null {
  if (matchesPassword(password, getAdminPassword())) {
    return { role: "admin", promoterCode: null, promoterName: null };
  }
  if (matchesPassword(password, getScannerPassword())) {
    return { role: "scanner", promoterCode: null, promoterName: null };
  }
  const promoter = findPromoterByLoginPassword(password);
  if (promoter) {
    return {
      role: "promoter",
      promoterCode: promoter.code,
      promoterName: promoter.name,
    };
  }
  return null;
}

export function createStaffSessionToken(login: ResolvedStaffLogin) {
  const issuedAt = Date.now().toString();
  const payload =
    login.role === "promoter"
      ? `promoter.${login.promoterCode}.${issuedAt}`
      : `${login.role}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function parseStaffSessionToken(
  token: string | undefined
): StaffSession | null {
  if (!token) return null;
  const parts = token.split(".");

  if (parts.length === 3) {
    const [role, issuedAt, signature] = parts;
    if (role !== "admin" && role !== "scanner") return null;
    if (!issuedAt || !signature) return null;

    const payload = `${role}.${issuedAt}`;
    if (!verifySignature(payload, signature)) return null;
    if (!isFresh(issuedAt)) return null;

    return {
      role,
      promoterCode: null,
      promoterName: null,
      issuedAt: Number(issuedAt),
    };
  }

  if (parts.length === 4) {
    const [role, promoterCode, issuedAt, signature] = parts;
    if (role !== "promoter" || !promoterCode || !issuedAt || !signature) {
      return null;
    }

    const payload = `promoter.${promoterCode}.${issuedAt}`;
    if (!verifySignature(payload, signature)) return null;
    if (!isFresh(issuedAt)) return null;

    const promoter = listAllPromoters().find((p) => p.code === promoterCode);
    if (!promoter) return null;

    return {
      role: "promoter",
      promoterCode: promoter.code,
      promoterName: promoter.name,
      issuedAt: Number(issuedAt),
    };
  }

  return null;
}

function verifySignature(payload: string, signature: string) {
  const expected = sign(payload);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    return true;
  } catch {
    return false;
  }
}

function isFresh(issuedAt: string) {
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age <= COOKIE_MAX_AGE * 1000;
}

export async function getStaffSession() {
  const jar = await cookies();
  return parseStaffSessionToken(jar.get(COOKIE_NAME)?.value);
}

/** Check-in scan: solo scanner o admin. */
export async function canScanCheckin() {
  const session = await getStaffSession();
  return Boolean(
    session && (session.role === "scanner" || session.role === "admin")
  );
}

/** Pannello admin: admin (tutto) o PR (solo i propri). */
export async function canAccessAdminPanel() {
  const session = await getStaffSession();
  return Boolean(
    session && (session.role === "admin" || session.role === "promoter")
  );
}

/** Mutazioni admin (segna presente, ecc.): solo admin. */
export async function canMutateAdmin() {
  const session = await getStaffSession();
  return Boolean(session && session.role === "admin");
}

/** @deprecated usa canScanCheckin / canAccessAdminPanel */
export async function isStaffAuthenticated(
  minRole: "scanner" | "admin" = "scanner"
) {
  if (minRole === "scanner") return canScanCheckin();
  return canMutateAdmin();
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
