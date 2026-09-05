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
  return path.join(process.cwd(), ".data", "registrations.json");
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

export function getRegistrationStorageMode() {
  return hasSupabase() ? "supabase" : "local";
}
