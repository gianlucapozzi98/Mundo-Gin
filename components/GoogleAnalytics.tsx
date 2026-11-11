import Script from "next/script";

/**
 * Google Analytics 4. Si attiva solo se è impostata la variabile
 * NEXT_PUBLIC_GA_ID (es. "G-XXXXXXXXXX"); senza, non carica nulla.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!gaId || !/^G-[A-Z0-9]+$/.test(gaId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
