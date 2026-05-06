"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyAccepted) return;
    setStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Errore invio");
      setStatus("done");
      form.reset();
      setPrivacyAccepted(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block font-futura-500 font-medium text-mundo-black mb-2"
        >
          Nome e cognome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-3 bg-mundo-white border border-mundo-black/20 rounded-lg font-futura-400 text-mundo-black focus:outline-none focus:ring-2 focus:ring-mundo-gold"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block font-futura-500 font-medium text-mundo-black mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 bg-mundo-white border border-mundo-black/20 rounded-lg font-futura-400 text-mundo-black focus:outline-none focus:ring-2 focus:ring-mundo-gold"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block font-futura-500 font-medium text-mundo-black mb-2"
        >
          Telefono
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full px-4 py-3 bg-mundo-white border border-mundo-black/20 rounded-lg font-futura-400 text-mundo-black focus:outline-none focus:ring-2 focus:ring-mundo-gold"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-futura-500 font-medium text-mundo-black mb-2"
        >
          Messaggio
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 bg-mundo-white border border-mundo-black/20 rounded-lg font-futura-400 text-mundo-black focus:outline-none focus:ring-2 focus:ring-mundo-gold resize-y min-h-[120px]"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="privacy"
          name="privacy"
          type="checkbox"
          required
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-mundo-black/20 text-mundo-gold focus:ring-mundo-gold"
        />
        <label
          htmlFor="privacy"
          className="font-futura-400 text-sm text-mundo-black/80"
        >
          Acconsento al trattamento dei dati personali nel rispetto di quanto
          stabilito dalla Legge 196/03 e dalla Privacy Policy
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending" || !privacyAccepted}
        className="group flex h-14 w-full items-center justify-center rounded border border-mundo-black/80 bg-transparent px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-mundo-gold focus-visible:ring-offset-2 disabled:opacity-70"
        aria-label={
          status === "done"
            ? "Messaggio inviato"
            : status === "error"
              ? "Errore invio"
              : "Invia messaggio"
        }
      >
        {status === "sending" ? (
          <span className="font-futura-400 text-mundo-black/80">
            Invio in corso...
          </span>
        ) : status === "done" ? (
          <span className="font-futura-500 text-mundo-black">Messaggio inviato</span>
        ) : status === "error" ? (
          <span className="font-futura-400 text-red-600">
            Si è verificato un errore. Riprova.
          </span>
        ) : (
          <span className="flex flex-row items-center justify-center gap-4 transition-all duration-300 group-hover:gap-8">
            <span className="transition-all duration-500 ease-in group-hover:rotate-[700deg]">
              <img
                src="/images/aereo%20invia.png"
                alt=""
                width={100}
                height={100}
                className="h-8 w-8 object-contain"
                loading="lazy"
              />
            </span>
            <span className="font-futura-500 text-base text-mundo-black sm:text-lg">
              Invia messaggio
            </span>
          </span>
        )}
      </button>
    </form>
  );
}
