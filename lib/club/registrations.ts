import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPromoterByCode, getRegisterableEvent } from "./catalog";

export type RegistrationRecord = {
  id: string;
  eventSlug: string;
  promoterCode: string | null;
  promoterName: string | null;
  firstName: string;
  lastName: string;
  qrToken: string;
  present: boolean;
  checkedInAt: string | null;
  createdAt: string;
};

type CreateRegistrationInput = {
  eventSlug: string;
  promoterCode?: string | null;
  firstName: string;
  lastName: string;
};

function createQrToken() {
  const raw = randomBytes(6).toString("hex").toUpperCase();
  return `MUNDO-${raw}`;
}

function createId() {
  return randomBytes(16).toString("hex");
}

function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function localStorePath() {
  // On Vercel the app filesystem is read-only; /tmp is writable per instance.
  const base =
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? "/tmp"
      : path.join(process.cwd(), ".data");
  return path.join(base, "registrations.json");
}

async function readLocalStore(): Promise<RegistrationRecord[]> {
  try {
    const raw = await fs.readFile(localStorePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as RegistrationRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeLocalStore(rows: RegistrationRecord[]) {
  const dir = path.dirname(localStorePath());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(localStorePath(), JSON.stringify(rows, null, 2), "utf8");
}

async function createLocalRegistration(
  input: CreateRegistrationInput
): Promise<RegistrationRecord> {
  const event = getRegisterableEvent(input.eventSlug);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const promoter = getPromoterByCode(
    input.eventSlug,
    input.promoterCode ?? undefined
  );
  // Unknown codes are ignored (treated as no promoter)
  const rows = await readLocalStore();
  const record: RegistrationRecord = {
    id: createId(),
    eventSlug: input.eventSlug,
    promoterCode: promoter?.code ?? null,
    promoterName: promoter?.name ?? null,
    firstName: input.firstName,
    lastName: input.lastName,
    qrToken: createQrToken(),
    present: false,
    checkedInAt: null,
    createdAt: new Date().toISOString(),
  };
  rows.push(record);
  await writeLocalStore(rows);
  return record;
}

async function createSupabaseRegistration(
  input: CreateRegistrationInput
): Promise<RegistrationRecord> {
  const supabase = getSupabaseAdmin();
  const event = getRegisterableEvent(input.eventSlug);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("slug", input.eventSlug)
    .single();

  if (eventError || !eventRow) throw new Error("EVENT_NOT_FOUND");

  let promoterId: string | null = null;
  let promoterCode: string | null = null;
  let promoterName: string | null = null;
  const known = getPromoterByCode(
    input.eventSlug,
    input.promoterCode ?? undefined
  );

  if (known) {
    const { data: promoterRow } = await supabase
      .from("promoters")
      .select("id, name, code")
      .eq("code", known.code)
      .maybeSingle();

    if (promoterRow) {
      promoterId = promoterRow.id;
      promoterCode = promoterRow.code;
      promoterName = promoterRow.name;
    }
  }

  const qrToken = createQrToken();
  const { data, error } = await supabase
    .from("registrations")
    .insert({
      event_id: eventRow.id,
      promoter_id: promoterId,
      first_name: input.firstName,
      last_name: input.lastName,
      qr_token: qrToken,
    })
    .select(
      "id, first_name, last_name, qr_token, present, checked_in_at, created_at"
    )
    .single();

  if (error || !data) {
    console.error("Supabase registration error:", error);
    throw new Error("SAVE_FAILED");
  }

  return {
    id: data.id,
    eventSlug: input.eventSlug,
    promoterCode,
    promoterName,
    firstName: data.first_name,
    lastName: data.last_name,
    qrToken: data.qr_token,
    present: data.present,
    checkedInAt: data.checked_in_at,
    createdAt: data.created_at,
  };
}

export async function createRegistration(input: CreateRegistrationInput) {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  if (!firstName || !lastName) throw new Error("INVALID_NAME");
  if (!getRegisterableEvent(input.eventSlug)) throw new Error("EVENT_NOT_FOUND");

  if (hasSupabase()) {
    return createSupabaseRegistration({
      ...input,
      firstName,
      lastName,
    });
  }

  return createLocalRegistration({
    ...input,
    firstName,
    lastName,
  });
}

export type CheckInResult =
  | { status: "ok"; registration: RegistrationRecord }
  | { status: "already"; registration: RegistrationRecord }
  | { status: "not_found" };

function normalizeToken(raw: string) {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("token");
    if (fromQuery) return fromQuery.trim().toUpperCase();
  } catch {
    // not a URL
  }
  const match = trimmed.match(/MUNDO-[A-Z0-9]+/i);
  return (match?.[0] ?? trimmed).toUpperCase();
}

async function findLocalByToken(token: string) {
  const rows = await readLocalStore();
  return rows.find((r) => r.qrToken.toUpperCase() === token) ?? null;
}

async function checkInLocal(token: string): Promise<CheckInResult> {
  const rows = await readLocalStore();
  const idx = rows.findIndex((r) => r.qrToken.toUpperCase() === token);
  if (idx < 0) return { status: "not_found" };

  const current = rows[idx];
  if (current.present) {
    return { status: "already", registration: current };
  }

  const updated: RegistrationRecord = {
    ...current,
    present: true,
    checkedInAt: new Date().toISOString(),
  };
  rows[idx] = updated;
  await writeLocalStore(rows);
  return { status: "ok", registration: updated };
}

async function findSupabaseByToken(token: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, first_name, last_name, qr_token, present, checked_in_at, created_at, event_id, promoter_id, events(slug), promoters(name, code)"
    )
    .eq("qr_token", token)
    .maybeSingle();

  if (error || !data) return null;

  const events = data.events as { slug?: string } | { slug?: string }[] | null;
  const promoters = data.promoters as
    | { name?: string; code?: string }
    | { name?: string; code?: string }[]
    | null;
  const eventSlug = Array.isArray(events)
    ? events[0]?.slug
    : events?.slug;
  const promoter = Array.isArray(promoters) ? promoters[0] : promoters;

  return {
    id: data.id,
    eventSlug: eventSlug ?? "",
    promoterCode: promoter?.code ?? null,
    promoterName: promoter?.name ?? null,
    firstName: data.first_name,
    lastName: data.last_name,
    qrToken: data.qr_token,
    present: data.present,
    checkedInAt: data.checked_in_at,
    createdAt: data.created_at,
  } satisfies RegistrationRecord;
}

async function checkInSupabase(token: string): Promise<CheckInResult> {
  const existing = await findSupabaseByToken(token);
  if (!existing) return { status: "not_found" };
  if (existing.present) return { status: "already", registration: existing };

  const supabase = getSupabaseAdmin();
  const checkedInAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("registrations")
    .update({ present: true, checked_in_at: checkedInAt })
    .eq("qr_token", token)
    .eq("present", false)
    .select(
      "id, first_name, last_name, qr_token, present, checked_in_at, created_at"
    )
    .maybeSingle();

  if (error) {
    console.error("Supabase check-in error:", error);
    throw new Error("CHECKIN_FAILED");
  }

  if (!data) {
    const again = await findSupabaseByToken(token);
    if (again?.present) return { status: "already", registration: again };
    return { status: "not_found" };
  }

  return {
    status: "ok",
    registration: {
      ...existing,
      present: true,
      checkedInAt: data.checked_in_at,
    },
  };
}

export async function checkInByToken(rawToken: string): Promise<CheckInResult> {
  const token = normalizeToken(rawToken);
  if (!token) return { status: "not_found" };

  if (hasSupabase()) return checkInSupabase(token);
  return checkInLocal(token);
}

export type EventStats = {
  eventSlug: string;
  total: number;
  present: number;
  absent: number;
  byPromoter: Array<{
    code: string | null;
    name: string;
    registered: number;
    present: number;
    conversion: number;
  }>;
};

async function listLocalByEvent(eventSlug: string) {
  const rows = await readLocalStore();
  return rows.filter((r) => r.eventSlug === eventSlug);
}

async function listSupabaseByEvent(eventSlug: string) {
  const supabase = getSupabaseAdmin();
  const { data: eventRow } = await supabase
    .from("events")
    .select("id")
    .eq("slug", eventSlug)
    .maybeSingle();
  if (!eventRow) return [] as RegistrationRecord[];

  const { data, error } = await supabase
    .from("registrations")
    .select(
      "id, first_name, last_name, qr_token, present, checked_in_at, created_at, promoters(name, code)"
    )
    .eq("event_id", eventRow.id);

  if (error || !data) return [];

  return data.map((row) => {
    const promoters = row.promoters as
      | { name?: string; code?: string }
      | { name?: string; code?: string }[]
      | null;
    const promoter = Array.isArray(promoters) ? promoters[0] : promoters;
    return {
      id: row.id,
      eventSlug,
      promoterCode: promoter?.code ?? null,
      promoterName: promoter?.name ?? null,
      firstName: row.first_name,
      lastName: row.last_name,
      qrToken: row.qr_token,
      present: row.present,
      checkedInAt: row.checked_in_at,
      createdAt: row.created_at,
    } satisfies RegistrationRecord;
  });
}

export async function getEventStats(eventSlug: string): Promise<EventStats> {
  const event = getRegisterableEvent(eventSlug);
  if (!event) throw new Error("EVENT_NOT_FOUND");

  const rows = hasSupabase()
    ? await listSupabaseByEvent(eventSlug)
    : await listLocalByEvent(eventSlug);

  const total = rows.length;
  const present = rows.filter((r) => r.present).length;
  const byPromoterMap = new Map<
    string,
    { code: string | null; name: string; registered: number; present: number }
  >();

  for (const promoter of event.promoters) {
    byPromoterMap.set(promoter.code, {
      code: promoter.code,
      name: promoter.name,
      registered: 0,
      present: 0,
    });
  }

  for (const row of rows) {
    const key = row.promoterCode ?? "__none__";
    if (!byPromoterMap.has(key)) {
      byPromoterMap.set(key, {
        code: row.promoterCode,
        name: row.promoterName ?? (row.promoterCode ? row.promoterCode : "Senza referral"),
        registered: 0,
        present: 0,
      });
    }
    const bucket = byPromoterMap.get(key)!;
    bucket.registered += 1;
    if (row.present) bucket.present += 1;
  }

  if (!byPromoterMap.has("__none__")) {
    byPromoterMap.set("__none__", {
      code: null,
      name: "Senza referral",
      registered: 0,
      present: 0,
    });
  }

  const byPromoter = [...byPromoterMap.values()]
    .map((b) => ({
      ...b,
      conversion:
        b.registered === 0
          ? 0
          : Math.round((b.present / b.registered) * 100),
    }))
    .sort((a, b) => b.registered - a.registered);

  return {
    eventSlug,
    total,
    present,
    absent: total - present,
    byPromoter,
  };
}

export async function listRegistrationsByEvent(eventSlug: string) {
  if (!getRegisterableEvent(eventSlug)) throw new Error("EVENT_NOT_FOUND");
  const rows = hasSupabase()
    ? await listSupabaseByEvent(eventSlug)
    : await listLocalByEvent(eventSlug);
  return [...rows].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function setPresentById(
  id: string,
  present: boolean
): Promise<RegistrationRecord | null> {
  if (hasSupabase()) {
    const supabase = getSupabaseAdmin();
    const checkedInAt = present ? new Date().toISOString() : null;
    const { data, error } = await supabase
      .from("registrations")
      .update({ present, checked_in_at: checkedInAt })
      .eq("id", id)
      .select(
        "id, first_name, last_name, qr_token, present, checked_in_at, created_at, event_id, promoters(name, code), events(slug)"
      )
      .maybeSingle();

    if (error || !data) {
      console.error("Supabase setPresent error:", error);
      return null;
    }

    const events = data.events as { slug?: string } | { slug?: string }[] | null;
    const promoters = data.promoters as
      | { name?: string; code?: string }
      | { name?: string; code?: string }[]
      | null;
    const eventSlug = Array.isArray(events) ? events[0]?.slug : events?.slug;
    const promoter = Array.isArray(promoters) ? promoters[0] : promoters;

    return {
      id: data.id,
      eventSlug: eventSlug ?? "",
      promoterCode: promoter?.code ?? null,
      promoterName: promoter?.name ?? null,
      firstName: data.first_name,
      lastName: data.last_name,
      qrToken: data.qr_token,
      present: data.present,
      checkedInAt: data.checked_in_at,
      createdAt: data.created_at,
    };
  }

  const rows = await readLocalStore();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const updated: RegistrationRecord = {
    ...rows[idx],
    present,
    checkedInAt: present ? new Date().toISOString() : null,
  };
  rows[idx] = updated;
  await writeLocalStore(rows);
  return updated;
}

export function getRegistrationStorageMode() {
  return hasSupabase() ? "supabase" : "local";
}
