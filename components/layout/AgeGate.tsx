"use client";

import { useEffect, useState } from "react";

const AGE_GATE_KEY = "mundo-age-gate";

export function AgeGate() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(AGE_GATE_KEY) === "yes";
    setIsAllowed(accepted);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    document.body.style.overflow = isAllowed ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAllowed, isLoaded]);

  if (!isLoaded || isAllowed) return null;

  const confirmAdult = () => {
    window.localStorage.setItem(AGE_GATE_KEY, "yes");
    setIsAllowed(true);
  };

  const denyAccess = () => {
    setIsDenied(true);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-mundo-black/75 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-xl bg-mundo-white p-6 text-center shadow-2xl sm:p-8">
        {!isDenied ? (
          <>
            <h2 className="font-futura-500 text-2xl uppercase text-mundo-black sm:text-3xl">
              Hai gia compiuto 18 anni?
            </h2>
            <p className="mt-4 font-futura-400 text-base leading-relaxed text-mundo-black/75 sm:text-lg">
              Devi essere maggiorenne per poter accedere al sito.
            </p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={confirmAdult}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-mundo-black px-6 py-2.5 font-futura-500 text-mundo-white transition-colors hover:bg-mundo-black/90"
              >
                Si
              </button>
              <button
                type="button"
                onClick={denyAccess}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-mundo-black/20 px-6 py-2.5 font-futura-500 text-mundo-black transition-colors hover:bg-mundo-black/5"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="font-futura-500 text-2xl uppercase text-mundo-black sm:text-3xl">
              Accesso non consentito
            </h2>
            <p className="mt-4 font-futura-400 text-base leading-relaxed text-mundo-black/75 sm:text-lg">
              Il sito e riservato ai maggiorenni.
            </p>
            <button
              type="button"
              onClick={() => window.location.replace("https://www.google.com")}
              className="mt-7 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-mundo-black px-6 py-2.5 font-futura-500 text-mundo-white transition-colors hover:bg-mundo-black/90"
            >
              Esci
            </button>
          </>
        )}
      </div>
    </div>
  );
}
