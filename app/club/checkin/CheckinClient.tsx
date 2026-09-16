"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";

type AuthState = "loading" | "login" | "ready";
type StaffRole = "scanner" | "admin";

type ScanResult = {
  status: "ok" | "already" | "not_found";
  firstName?: string;
  lastName?: string;
  promoterName?: string | null;
  checkedInAt?: string | null;
  message: string;
};

type SearchHit = {
  id: string;
  firstName: string;
  lastName: string;
  promoterName: string | null;
  present: boolean;
  checkedInAt: string | null;
  qrToken: string;
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

function formatTime(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CheckinClient({ eventSlug }: { eventSlug: string }) {
  const [auth, setAuth] = useState<AuthState>("loading");
  const [role, setRole] = useState<StaffRole | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [nameHits, setNameHits] = useState<SearchHit[]>([]);
  const [nameSearching, setNameSearching] = useState(false);
  const [nameBusyId, setNameBusyId] = useState<string | null>(null);
  const [scanBusy, setScanBusy] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastTokenRef = useRef<string>("");

  const isAdmin = role === "admin";

  const refreshStats = useCallback(async () => {
    if (role !== "admin") return;
    try {
      const res = await fetch(
        `/api/club/checkin/stats?event=${encodeURIComponent(eventSlug)}`
      );
      if (!res.ok) return;
      const data = (await res.json()) as { stats?: Stats };
      if (data.stats) setStats(data.stats);
    } catch {
      /* ignore */
    }
  }, [eventSlug, role]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/club/checkin/auth");
        const data = (await res.json()) as {
          authenticated?: boolean;
          role?: StaffRole | null;
        };
        if (!cancelled) {
          if (data.authenticated && data.role) {
            setRole(data.role);
            setAuth("ready");
          } else {
            setAuth("login");
          }
        }
      } catch {
        if (!cancelled) setAuth("login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (auth === "ready" && role === "admin") {
      void refreshStats();
    }
  }, [auth, role, refreshStats]);

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .catch(() => undefined)
          .finally(() => {
            scanner.clear();
            scannerRef.current = null;
          });
      }
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/club/checkin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as {
        error?: string;
        role?: StaffRole;
      };
      if (!res.ok) {
        setLoginError(data.error ?? "Accesso non riuscito.");
        return;
      }
      setRole(data.role ?? null);
      setAuth("ready");
      setPassword("");
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
    await stopScanner();
    setAuth("login");
    setRole(null);
    setResult(null);
    setStats(null);
    setNameQuery("");
    setNameHits([]);
  }

  async function searchByName(raw: string) {
    const q = raw.trim();
    setNameQuery(raw);
    if (q.length < 2) {
      setNameHits([]);
      return;
    }
    setNameSearching(true);
    try {
      const res = await fetch(
        `/api/club/checkin/search?event=${encodeURIComponent(eventSlug)}&q=${encodeURIComponent(q)}`
      );
      if (!res.ok) {
        setNameHits([]);
        return;
      }
      const data = (await res.json()) as { registrations?: SearchHit[] };
      setNameHits(data.registrations ?? []);
    } catch {
      setNameHits([]);
    } finally {
      setNameSearching(false);
    }
  }

  async function markPresentById(hit: SearchHit) {
    if (nameBusyId) return;
    setNameBusyId(hit.id);
    try {
      const res = await fetch("/api/club/checkin/present", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hit.id }),
      });
      const data = (await res.json()) as {
        status?: "ok" | "already";
        error?: string;
        registration?: {
          firstName: string;
          lastName: string;
          promoterName: string | null;
          checkedInAt: string | null;
        };
      };
      if (!res.ok || !data.registration) {
        setResult({
          status: "not_found",
          message: data.error ?? "Impossibile segnare presente",
        });
        return;
      }
      if (data.status === "already") {
        setResult({
          status: "already",
          firstName: data.registration.firstName,
          lastName: data.registration.lastName,
          promoterName: data.registration.promoterName,
          checkedInAt: data.registration.checkedInAt,
          message: `Già presente · ingresso alle ${formatTime(data.registration.checkedInAt)}`,
        });
      } else {
        setResult({
          status: "ok",
          firstName: data.registration.firstName,
          lastName: data.registration.lastName,
          promoterName: data.registration.promoterName,
          checkedInAt: data.registration.checkedInAt,
          message: "Ingresso registrato",
        });
      }
      setNameHits((prev) =>
        prev.map((row) =>
          row.id === hit.id
            ? {
                ...row,
                present: true,
                checkedInAt: data.registration?.checkedInAt ?? row.checkedInAt,
              }
            : row
        )
      );
      void refreshStats();
    } catch {
      setResult({
        status: "not_found",
        message: "Errore di connessione",
      });
    } finally {
      setNameBusyId(null);
    }
  }

  async function processToken(raw: string) {
    const token = raw.trim();
    if (!token || scanBusy) return;
    if (token === lastTokenRef.current) return;
    lastTokenRef.current = token;
    setScanBusy(true);

    try {
      const res = await fetch("/api/club/checkin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json()) as {
        status?: "ok" | "already" | "not_found";
        error?: string;
        registration?: {
          firstName: string;
          lastName: string;
          promoterName: string | null;
          checkedInAt: string | null;
        };
      };

      if (data.status === "ok" && data.registration) {
        setResult({
          status: "ok",
          firstName: data.registration.firstName,
          lastName: data.registration.lastName,
          promoterName: data.registration.promoterName,
          checkedInAt: data.registration.checkedInAt,
          message: "Ingresso registrato con successo",
        });
      } else if (data.status === "already" && data.registration) {
        setResult({
          status: "already",
          firstName: data.registration.firstName,
          lastName: data.registration.lastName,
          promoterName: data.registration.promoterName,
          checkedInAt: data.registration.checkedInAt,
          message: `QR già utilizzato · ingresso alle ${formatTime(data.registration.checkedInAt)}`,
        });
      } else {
        setResult({
          status: "not_found",
          message: data.error ?? "QR non valido",
        });
      }
      void refreshStats();
    } catch {
      setResult({
        status: "not_found",
        message: "Errore di connessione",
      });
    } finally {
      window.setTimeout(() => {
        lastTokenRef.current = "";
        setScanBusy(false);
      }, 1800);
    }
  }

  async function startScanner() {
    setResult(null);
    const scanner = new Html5Qrcode("club-checkin-reader");
    scannerRef.current = scanner;
    setScanning(true);
    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 260, height: 260 } },
        (decoded) => {
          void processToken(decoded);
        },
        () => undefined
      );
    } catch {
      setScanning(false);
      scannerRef.current = null;
      setResult({
        status: "not_found",
        message:
          "Impossibile aprire la fotocamera. Usa l'inserimento manuale del token.",
      });
    }
  }

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner) {
      setScanning(false);
      return;
    }
    try {
      await scanner.stop();
      scanner.clear();
    } catch {
      /* ignore */
    }
    scannerRef.current = null;
    setScanning(false);
  }

  if (auth === "loading") {
    return (
      <p className="font-futura-400 text-mundo-black/70">Caricamento…</p>
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
          Check-in
        </h1>
        <p className="mt-3 font-futura-400 text-[17px] text-mundo-black/70">
          Accedi per scannerizzare i QR all&apos;ingresso.
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
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
            Mundo Club
          </p>
          <h1 className="mt-2 font-futura-500 text-3xl font-medium uppercase text-mundo-black sm:text-4xl">
            Check-in
          </h1>
          <p className="mt-2 font-futura-400 text-mundo-black/70">
            Mundo Castle · ingresso
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {isAdmin ? (
            <Link
              href="/club/admin"
              className="inline-flex items-center justify-center rounded-lg border border-mundo-black/20 px-4 py-2.5 font-futura-500 text-xs uppercase tracking-[0.12em] text-mundo-black/80"
            >
              Admin iscritti
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="shrink-0 font-futura-500 text-sm text-mundo-black/60 underline-offset-2 hover:text-mundo-black hover:underline"
          >
            Esci
          </button>
        </div>
      </div>

      {isAdmin && stats ? (
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

      <div className="rounded-2xl border border-mundo-black/10 bg-mundo-white p-4 sm:p-6">
        <div
          id="club-checkin-reader"
          className="overflow-hidden rounded-xl bg-mundo-black/5"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {!scanning ? (
            <button
              type="button"
              onClick={() => void startScanner()}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-mundo-black px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-white"
            >
              Avvia fotocamera
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void stopScanner()}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-mundo-black px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-black"
            >
              Ferma fotocamera
            </button>
          )}
          {isAdmin ? (
            <button
              type="button"
              onClick={() => void refreshStats()}
              className="inline-flex items-center justify-center rounded-lg border border-mundo-black/20 px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-black/80"
            >
              Aggiorna stats
            </button>
          ) : null}
        </div>

        <form
          className="mt-5 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void processToken(manualToken);
            setManualToken("");
          }}
        >
          <input
            type="text"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Token manuale (MUNDO-...)"
            className="min-w-0 flex-1 rounded-lg border border-mundo-black/20 px-3 py-2.5 font-futura-400 text-sm outline-none focus:border-mundo-black"
          />
          <button
            type="submit"
            className="rounded-lg bg-mundo-black px-4 py-2.5 font-futura-500 text-xs uppercase tracking-[0.12em] text-mundo-white"
          >
            Check
          </button>
        </form>

        <div className="mt-6 border-t border-mundo-black/10 pt-5">
          <p className="font-futura-500 text-xs uppercase tracking-[0.14em] text-mundo-black/55">
            Senza QR · cerca per nome
          </p>
          <input
            type="search"
            value={nameQuery}
            onChange={(e) => void searchByName(e.target.value)}
            placeholder="Nome o cognome…"
            className="mt-3 w-full rounded-lg border border-mundo-black/20 px-3 py-2.5 font-futura-400 text-sm outline-none focus:border-mundo-black"
            autoComplete="off"
          />
          {nameSearching ? (
            <p className="mt-3 font-futura-400 text-sm text-mundo-black/55">
              Ricerca…
            </p>
          ) : null}
          {nameQuery.trim().length >= 2 && !nameSearching && nameHits.length === 0 ? (
            <p className="mt-3 font-futura-400 text-sm text-mundo-black/55">
              Nessun iscritto trovato.
            </p>
          ) : null}
          {nameHits.length > 0 ? (
            <ul className="mt-3 divide-y divide-mundo-black/10 overflow-hidden rounded-xl border border-mundo-black/10">
              {nameHits.map((hit) => (
                <li
                  key={hit.id}
                  className="flex flex-col gap-3 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-futura-500 text-sm text-mundo-black">
                      {hit.firstName} {hit.lastName}
                    </p>
                    <p className="mt-0.5 font-futura-400 text-xs text-mundo-black/55">
                      {hit.promoterName ? `${hit.promoterName} · ` : ""}
                      {hit.present
                        ? `Presente · ${formatTime(hit.checkedInAt)}`
                        : "Non ancora entrato"}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={nameBusyId === hit.id || hit.present}
                    onClick={() => void markPresentById(hit)}
                    className="rounded-lg bg-mundo-black px-4 py-2.5 font-futura-500 text-xs uppercase tracking-[0.12em] text-mundo-white disabled:opacity-40"
                  >
                    {hit.present
                      ? "Già presente"
                      : nameBusyId === hit.id
                        ? "…"
                        : "Segna presente"}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {result ? (
        <div
          className={`rounded-2xl border p-5 ${
            result.status === "ok"
              ? "border-emerald-600/30 bg-emerald-50"
              : result.status === "already"
                ? "border-amber-600/30 bg-amber-50"
                : "border-red-600/30 bg-red-50"
          }`}
        >
          <p className="font-futura-500 text-lg uppercase text-mundo-black">
            {result.message}
          </p>
          {result.firstName ? (
            <p className="mt-2 font-futura-400 text-[18px] text-mundo-black/80">
              {result.firstName} {result.lastName}
              {result.promoterName ? ` · ${result.promoterName}` : ""}
            </p>
          ) : null}
        </div>
      ) : null}

      {isAdmin && stats && stats.byPromoter.length > 0 ? (
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
    </div>
  );
}
