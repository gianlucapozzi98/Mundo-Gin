"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AuthState = "loading" | "login" | "ready" | "scanner_blocked";
type StaffRole = "scanner" | "admin";

type RegistrationRow = {
  id: string;
  firstName: string;
  lastName: string;
  promoterName: string | null;
  promoterCode: string | null;
  qrToken: string;
  present: boolean;
  checkedInAt: string | null;
  createdAt: string;
};

type Stats = {
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

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminClient({ eventSlug }: { eventSlug: string }) {
  const [auth, setAuth] = useState<AuthState>("loading");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "present" | "absent">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/club/admin/registrations?event=${encodeURIComponent(eventSlug)}`
    );
    if (res.status === 401) {
      setAuth("login");
      return;
    }
    if (!res.ok) return;
    const data = (await res.json()) as {
      registrations?: RegistrationRow[];
      stats?: Stats;
    };
    setRows(data.registrations ?? []);
    setStats(data.stats ?? null);
  }, [eventSlug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/club/checkin/auth");
        const data = (await res.json()) as {
          authenticated?: boolean;
          role?: StaffRole | null;
        };
        if (cancelled) return;
        if (data.authenticated && data.role === "admin") {
          setAuth("ready");
          await load();
        } else if (data.authenticated && data.role === "scanner") {
          setAuth("scanner_blocked");
        } else {
          setAuth("login");
        }
      } catch {
        if (!cancelled) setAuth("login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/club/checkin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, requiredRole: "admin" }),
      });
      const data = (await res.json()) as { error?: string; role?: StaffRole };
      if (!res.ok) {
        setLoginError(data.error ?? "Accesso non riuscito.");
        return;
      }
      setAuth("ready");
      setPassword("");
      await load();
    } catch {
      setLoginError("Connessione non riuscita.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/club/checkin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuth("login");
    setRows([]);
    setStats(null);
  }

  async function togglePresent(row: RegistrationRow) {
    setBusyId(row.id);
    try {
      const res = await fetch("/api/club/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, present: !row.present }),
      });
      if (!res.ok) return;
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter === "present" && !row.present) return false;
      if (filter === "absent" && row.present) return false;
      if (!q) return true;
      const hay = `${row.firstName} ${row.lastName} ${row.promoterName ?? ""} ${row.qrToken}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, filter]);

  if (auth === "loading") {
    return (
      <p className="font-futura-400 text-mundo-black/70">Caricamento…</p>
    );
  }

  if (auth === "scanner_blocked") {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-mundo-black/10 bg-mundo-white p-6 sm:p-8">
        <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
          Accesso limitato
        </p>
        <h1 className="mt-3 font-futura-500 text-3xl font-medium uppercase text-mundo-black">
          Solo admin
        </h1>
        <p className="mt-3 font-futura-400 text-[17px] text-mundo-black/70">
          Sei autenticato come scanner. Questa area è riservata agli admin.
        </p>
        <Link
          href="/club/checkin"
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-mundo-black px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-white"
        >
          Vai al check-in
        </Link>
      </div>
    );
  }

  if (auth === "login") {
    return (
      <form
        onSubmit={handleLogin}
        className="mx-auto w-full max-w-md rounded-2xl border border-mundo-black/10 bg-mundo-white p-6 sm:p-8"
      >
        <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
          Staff only
        </p>
        <h1 className="mt-3 font-futura-500 text-3xl font-medium uppercase text-mundo-black">
          Admin
        </h1>
        <p className="mt-3 font-futura-400 text-[17px] text-mundo-black/70">
          Gestisci iscritti e ingressi.
        </p>
        <label className="mt-8 block font-futura-500 text-sm text-mundo-black">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-mundo-black/20 bg-white px-4 py-3 font-futura-400 outline-none focus:border-mundo-black"
            autoComplete="current-password"
            required
          />
        </label>
        {loginError ? (
          <p className="mt-3 font-futura-400 text-sm text-red-700" role="alert">
            {loginError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loggingIn}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-mundo-black px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-white disabled:opacity-50"
        >
          {loggingIn ? "Accesso…" : "Entra"}
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
            Mundo Club
          </p>
          <h1 className="mt-2 font-futura-500 text-3xl font-medium uppercase text-mundo-black sm:text-4xl">
            Admin
          </h1>
          <p className="mt-2 font-futura-400 text-mundo-black/70">
            Mundo Castel · iscritti e ingressi
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/club/checkin"
            className="inline-flex items-center justify-center rounded-lg border border-mundo-black px-4 py-2.5 font-futura-500 text-xs uppercase tracking-[0.12em] text-mundo-black"
          >
            Vai al check-in
          </Link>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center justify-center rounded-lg border border-mundo-black/20 px-4 py-2.5 font-futura-500 text-xs uppercase tracking-[0.12em] text-mundo-black/80"
          >
            Aggiorna
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="font-futura-500 text-sm text-mundo-black/60 underline-offset-2 hover:text-mundo-black hover:underline"
          >
            Esci
          </button>
        </div>
      </div>

      {stats ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-mundo-black/10 bg-mundo-white p-4 text-center">
            <p className="font-futura-500 text-2xl text-mundo-black">
              {stats.total}
            </p>
            <p className="mt-1 font-futura-400 text-xs uppercase tracking-wide text-mundo-black/55">
              Iscritti
            </p>
          </div>
          <div className="rounded-xl border border-mundo-black/10 bg-mundo-white p-4 text-center">
            <p className="font-futura-500 text-2xl text-mundo-black">
              {stats.present}
            </p>
            <p className="mt-1 font-futura-400 text-xs uppercase tracking-wide text-mundo-black/55">
              Presenti
            </p>
          </div>
          <div className="rounded-xl border border-mundo-black/10 bg-mundo-white p-4 text-center">
            <p className="font-futura-500 text-2xl text-mundo-black">
              {stats.absent}
            </p>
            <p className="mt-1 font-futura-400 text-xs uppercase tracking-wide text-mundo-black/55">
              Assenti
            </p>
          </div>
        </div>
      ) : null}

      {stats && stats.byPromoter.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white">
          <div className="border-b border-mundo-black/10 px-4 py-3">
            <p className="font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-black">
              Performance referral
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="border-b border-mundo-black/10 font-futura-500 text-xs uppercase tracking-wide text-mundo-black/55">
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 text-right">Iscritti</th>
                  <th className="px-4 py-3 text-right">Presenti</th>
                  <th className="px-4 py-3 text-right">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {stats.byPromoter.map((row) => (
                  <tr
                    key={row.code ?? "none"}
                    className="border-b border-mundo-black/5 font-futura-400 text-sm text-mundo-black/80"
                  >
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {row.registered}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {row.present}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {row.conversion}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca nome, referral o token…"
          className="min-w-0 flex-1 rounded-lg border border-mundo-black/20 bg-mundo-white px-4 py-3 font-futura-400 outline-none focus:border-mundo-black"
        />
        <div className="flex gap-2">
          {(
            [
              ["all", "Tutti"],
              ["present", "Presenti"],
              ["absent", "Assenti"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full border px-3 py-2 font-futura-500 text-xs uppercase tracking-[0.12em] ${
                filter === value
                  ? "border-mundo-black bg-mundo-black text-mundo-white"
                  : "border-mundo-black/20 text-mundo-black/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-mundo-black/10 bg-mundo-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-mundo-black/10 font-futura-500 text-xs uppercase tracking-wide text-mundo-black/55">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Referral</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Iscrizione</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3 text-right">Azione</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center font-futura-400 text-mundo-black/55"
                  >
                    Nessuna registrazione trovata.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-mundo-black/5 font-futura-400 text-sm text-mundo-black/80"
                  >
                    <td className="px-4 py-3 font-futura-500 text-mundo-black">
                      {row.firstName} {row.lastName}
                    </td>
                    <td className="px-4 py-3">
                      {row.promoterName ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {row.qrToken}
                    </td>
                    <td className="px-4 py-3">{formatDateTime(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      {row.present ? (
                        <span className="text-emerald-700">
                          Presente · {formatDateTime(row.checkedInAt)}
                        </span>
                      ) : (
                        <span className="text-mundo-black/50">Assente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void togglePresent(row)}
                        className="rounded-full border border-mundo-black/25 px-3 py-1.5 font-futura-500 text-xs uppercase tracking-wide text-mundo-black disabled:opacity-50"
                      >
                        {row.present ? "Annulla" : "Segna presente"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
