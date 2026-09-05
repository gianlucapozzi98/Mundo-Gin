"use client";

import { useState } from "react";
import Link from "next/link";
import type { ClubEventDetails } from "@/lib/club/catalog";
import { PRIVACY_POLICY_URL } from "@/lib/club/catalog";

type Props = {
  event: ClubEventDetails;
  promoterCode: string | null;
};

type RegistrationSuccess = {
  firstName: string;
  lastName: string;
  qrToken: string;
  qrDataUrl: string;
};

export function EventRegistrationForm({ event, promoterCode }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RegistrationSuccess | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!privacyAccepted) return;
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/club/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: event.slug,
          promoterCode,
          firstName,
          lastName,
          privacyAccepted,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        qrDataUrl?: string;
        registration?: {
          firstName: string;
          lastName: string;
          qrToken: string;
        };
      };

      if (!res.ok || !data.registration || !data.qrDataUrl) {
        throw new Error(data.error ?? "Errore registrazione");
      }

      setSuccess({
        firstName: data.registration.firstName,
        lastName: data.registration.lastName,
        qrToken: data.registration.qrToken,
        qrDataUrl: data.qrDataUrl,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Impossibile completare la registrazione."
      );
    }
  }

  async function saveQrToDevice() {
    if (!success) return;
    const fileName = `mundo-castel-${success.qrToken}.png`;

    try {
      const res = await fetch(success.qrDataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: "image/png" });

      // iPhone/iPad: apre il foglio Condividi → "Salva immagine" / Foto
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "QR Mundo Club",
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Utente ha chiuso il foglio Condividi: non è un errore
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Ultimo fallback: apri l'immagine (su iPhone → tieni premuto → Salva in Foto)
      window.open(success.qrDataUrl, "_blank", "noopener,noreferrer");
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-mundo-black/10 bg-mundo-white p-6 sm:p-8">
        <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
          Registrazione confermata
        </p>
        <h2 className="mt-3 font-futura-500 text-3xl uppercase text-mundo-black">
          Ciao {success.firstName}
        </h2>
        <p className="mt-3 font-futura-400 text-[18px] leading-relaxed text-mundo-black/75">
          Salva subito il tuo QR: ti servirà all&apos;ingresso. Non te lo potremo
          reinviare.
        </p>

        <div className="mx-auto mt-8 max-w-[280px] rounded-2xl border border-mundo-black/10 bg-white p-4">
          <img
            src={success.qrDataUrl}
            alt={`QR code per ${success.firstName} ${success.lastName}`}
            className="h-auto w-full"
          />
        </div>
        <p className="mt-3 text-center font-futura-500 text-sm tracking-wide text-mundo-black/60">
          {success.qrToken}
        </p>
        <p className="mt-2 text-center font-futura-400 text-sm text-mundo-black/55">
          Su iPhone: Salva QR → Salva immagine, oppure tieni premuto il QR.
        </p>

        <button
          type="button"
          onClick={() => void saveQrToDevice()}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-mundo-black px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-black transition-colors hover:bg-mundo-black hover:text-mundo-white"
        >
          Salva QR
        </button>

        <a
          href={event.whatsappCommunityUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#25D366] px-5 py-3 font-futura-500 text-sm uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
        >
          Entra nella community WhatsApp
        </a>

        <p className="mt-6 font-futura-400 text-sm leading-relaxed text-mundo-black/60">
          Ti aspettiamo il {event.dateLabel} · {event.timeLabel}
          <br />
          {event.address}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-mundo-black/10 bg-mundo-white p-6 sm:p-8"
    >
      <p className="font-futura-500 text-xs uppercase tracking-[0.16em] text-mundo-black/55">
        Registrazione gratuita
      </p>
      <h2 className="mt-3 font-futura-500 text-2xl uppercase text-mundo-black sm:text-3xl">
        Prenota il tuo ingresso
      </h2>
      <p className="mt-3 font-futura-400 text-[17px] leading-relaxed text-mundo-black/70">
        Compila i dati e ricevi subito il QR da mostrare all&apos;ingresso.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block font-futura-500 text-sm text-mundo-black"
          >
            Nome
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-mundo-black/20 bg-white px-4 py-3 font-futura-400 text-mundo-black outline-none transition-colors focus:border-mundo-black"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block font-futura-500 text-sm text-mundo-black"
          >
            Cognome
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-mundo-black/20 bg-white px-4 py-3 font-futura-400 text-mundo-black outline-none transition-colors focus:border-mundo-black"
          />
        </div>

        <label className="flex items-start gap-3 font-futura-400 text-sm leading-relaxed text-mundo-black/75">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1"
            required
          />
          <span>
            Accetto la{" "}
            <Link
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>

      {error ? (
        <p className="mt-4 font-futura-400 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending" || !privacyAccepted}
        className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-mundo-black px-5 py-3.5 font-futura-500 text-sm uppercase tracking-[0.14em] text-mundo-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Registrazione…" : "Registrati all'evento"}
      </button>
    </form>
  );
}
