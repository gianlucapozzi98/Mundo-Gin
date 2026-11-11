# Audit SEO + GEO — mundogin.com

> Documento di contesto da incollare in un'altra chat. Data rilevazione: **11 novembre 2026**.
> Fonti: codice del repo `gianlucapozzi98/Mundo-Gin` (branch `main`), HTML del sito live, ricerche su Google Italia (`hl=it&gl=it`, sessione non loggata).
> Limiti: nessun accesso a Search Console, analytics o tool di backlink. Le posizioni Google sono un'istantanea e possono variare per utente e giorno.

## 1. Contesto

- **Brand**: Mundo Gin — "Italian Coffee Dry Gin", London Dry italiano distillato con caffè specialty. Mundo Gin S.N.C., Caravaggio (BG).
- **Prodotti online**: Mundo Gin 70 cl a €45; Mundo Beer (pilsner 33 cl, singola e pack). Spedizione gratuita da €50.
- **Stack**: Next.js 16 (App Router) su Vercel, Stripe Checkout, Supabase (iscrizioni eventi Mundo Club), Meta Pixel. Dominio canonico voluto: `https://www.mundogin.com`.
- **Pagine**: `/`, `/about`, `/shop`, `/shop/mundo-gin`, `/shop/mundo-beer`, `/cocktail`, `/dove-provarci`, `/club` (+ `/club/[slug]` eventi), `/contatti`, `/sostenibilita`, `/termini-e-condizioni`, `/carrello`, `/ordine-ricevuto`.
- **Obiettivo**: più visite organiche e più vendite online. Oggi visite e conversioni sono molto poche.

## 2. Giudizio sintetico

| Area | Livello | Motivo principale |
|---|---|---|
| SEO tecnica | Basso | Niente robots.txt, sitemap, canonical, dati strutturati |
| Indicizzazione | Critico | Google mostra 5 pagine, nessuna è una pagina prodotto |
| Visibilità brand | Critico | Il sito non è in prima pagina cercando "mundo gin" |
| Visibilità non-brand | Assente | Nessuna presenza per "gin al caffè" e simili |
| Contenuti | Basso | Pagine da 90–370 parole, nessun blog/guida, 4 ricette senza pagina propria |
| GEO (motori AI) | Assente | Nessuno schema, nessun llms.txt, quasi nessuna citazione di terzi |
| Conversione | Medio-basso | Spedizione non dichiarata prima del checkout, nessuna recensione, nessuna cattura email |

## 3. Cosa si vede su Google Italia

| Ricerca | Risultato |
|---|---|
| `site:mundogin.com` | Solo 5 pagine: home, sostenibilità, contatti, dove-provarci, termini. Mancano `/shop`, `/shop/mundo-gin`, `/shop/mundo-beer`, `/about`, `/cocktail`, `/club`. Quattro su cinque sono indicizzate come `mundogin.com` senza www. Compare anche `checkout.mundogin.com` |
| `mundo gin` | Il sito **non è in prima pagina**. Compaiono Instagram di altri, Amazon "Gin dal mondo", Esselunga, Beverfood. Mundo appare solo nel box immagini (mundogin.com, Bevo.it, Instagram) e con un vecchio post Instagram di `mundo_gin` |
| `mundogin` | Il sito non compare in prima pagina |
| `mundo gin caffè` | Il sito non compare; solo immagini da Bevo.it e Instagram |
| `gin al caffè` | Dominano 400 Conigli Coffee Gin, ilGin.it, Elephant Gin Coffee Liqueur, Il Gin del Baffo (Caffè Agust), Peroni Maddalena, Nikka. Mundo assente |
| `gin al caffè italiano acquista online` | Amazon, ilGin.it, 400 Conigli (su più rivenditori), Ginferno, Trovaprezzi. Mundo assente |
| `italian coffee dry gin` | Mundo solo nel box immagini (Bevo.it, Instagram). Nessun risultato web del sito |

Titoli e snippet delle pagine indicizzate sono vecchi (es. "Sostenibilità", "Contatti" invece dei title attuali): Google non ha ancora riletto le pagine dopo gli ultimi aggiornamenti SEO.

**Lettura**: il problema principale non è la concorrenza, è che Google conosce a malapena il sito. "Mundo gin" è anche un nome ambiguo ("mundo" = "mondo", confusione con "gin dal mondo", Caffè El Mundo), quindi senza segnali forti di entità il brand non vince nemmeno sul proprio nome.

## 4. Problemi tecnici rilevati

### Critici
1. **`/robots.txt` risponde 404.** Non esiste `app/robots.ts`.
2. **`/sitemap.xml` risponde 404.** Non esiste `app/sitemap.ts`. Google non ha un elenco delle pagine.
3. **Nessun canonical su nessuna pagina.** Non è impostato `alternates.canonical`.
4. **`og:url` è `https://www.mundogin.com` su tutte le pagine**, ereditato da `app/layout.tsx`. Ogni pagina dichiara di essere la home.
5. **`mundogin.com` → `www.mundogin.com` usa un redirect 307 (temporaneo)** invece di 308. Insieme all'assenza di canonical spiega perché Google tiene indicizzata la versione senza www.
6. **Zero dati strutturati (JSON-LD)** in tutto il sito: niente `Organization`, `WebSite`, `Product`/`Offer`, `Recipe`, `Event`, `BreadcrumbList`, `FAQPage`.
7. **`/shop/mundo-beer` non ha metadata propri**: title e description identici alla home (la pagina è `"use client"` e manca un `layout.tsx` come quello di `/shop/mundo-gin`).
8. **Nessun Google Analytics / Search Console verificabile dal codice.** C'è solo il Meta Pixel: il traffico organico non è misurato.

### Importanti
9. **H1 deboli**: home "Scopri il sapore del mondo con il gusto di Mundo" (senza "gin" né "caffè"); `/about` "Mundo"; `/shop` "Welcome to the Mundo's Webshop" (inglese su sito italiano); prodotto "MUNDO GIN".
10. **Contenuto scarso**: home ~370 parole, `/about` ~280, prodotto gin ~250, `/cocktail` ~155, `/shop` ~90.
11. **Cocktail tutti in un'unica pagina** (Mundo Tonic, Mundo Negroni, Espresso Mundo, Dormo Domani): nessun URL per ricetta, nessuno schema `Recipe`.
12. **Immagini pesanti**: `public/images` pesa 51 MB; diversi file da 1–10 MB (`tost.jpeg` 9,7 MB, `Pattern1new.png` 3,4 MB, `mundo-world-final.png` 2,2 MB). Quasi tutto usa `<img>` normale: `next/image` è usato in un solo file. Nomi file con spazi (`Logo 5 n.png`).
13. **Alt mancanti o vuoti**: 7 su 12 immagini nelle pagine prodotto, 5 su 17 in `/club`.
14. **Description troppo corte** su `/cocktail` (33 caratteri), `/contatti` (54), `/shop` (61).
15. **Solo italiano**: nessuna versione inglese né `hreflang`, pur con payoff in inglese.
16. **`checkout.mundogin.com` indicizzato** (risponde 204 con `x-robots-tag: noindex`; va richiesta la rimozione in Search Console).
17. `/carrello` e `/ordine-ricevuto` sono indicizzabili; conviene `noindex`.

### Cose che funzionano
- Le pagine sono pre-renderizzate: il testo è nell'HTML, anche con age gate (è un overlay lato client, non blocca i crawler).
- HTTPS, HSTS, risposta veloce dalla cache Vercel.
- `lang="it"`, Open Graph e Twitter card presenti, `metadataBase` corretto.
- Title e description curati su home, `/about`, `/shop/mundo-gin`, `/dove-provarci`.
- `/club/admin` e `/club/checkin` sono `noindex, nofollow`.
- `/dove-provarci` ha molto contenuto locale (555 parole, decine di locali).

## 5. GEO — visibilità nei motori AI (ChatGPT, Perplexity, Gemini, AI Overview)

Stato: praticamente assente.
- Una ricerca web per "Mundo Gin Italian Coffee Dry Gin" su un indice usato da assistenti AI non restituisce il sito né il prodotto: un assistente oggi risponderebbe con Buosi, Gin del CoffeeMaker, 400 Conigli, Lava.
- Nessun dato strutturato da cui estrarre fatti (prezzo, gradazione, botaniche, produttore).
- Nessuna pagina che risponde a domande dirette ("cos'è un gin al caffè", "come si beve", "quale tonica").
- Pochissime fonti terze che citano il brand: Bevo.it, Instagram, forse un articolo di fancy Magazine sul World Gin Day. Assente da ilGin.it e Ginferno, che invece compaiono per quasi tutte le ricerche di categoria.
- Nessun `llms.txt`.

I motori AI citano ciò che trovano ripetuto su più fonti autorevoli e ciò che è scritto in forma di fatto chiaro. Servono entrambe le cose.

## 6. Piano d'azione in ordine di priorità

### Fase 1 — Fondamenta tecniche (1–2 giorni di sviluppo)
1. Creare `app/robots.ts` (allow tutto, disallow `/api/`, `/club/admin`, `/club/checkin`, `/carrello`, `/ordine-ricevuto`; link alla sitemap).
2. Creare `app/sitemap.ts` con tutte le pagine pubbliche e gli eventi `/club/[slug]`.
3. Aggiungere `alternates.canonical` a ogni pagina e togliere `openGraph.url` fisso dal layout (o impostarlo per pagina).
4. In Vercel → Domains, impostare il redirect `mundogin.com` → `www` come **308 permanente**.
5. Aggiungere `app/shop/mundo-beer/layout.tsx` con title e description propri.
6. JSON-LD:
   - layout: `Organization` (nome, logo, indirizzo, P.IVA, `sameAs` Instagram/Facebook) + `WebSite`;
   - `/shop/mundo-gin` e `/shop/mundo-beer`: `Product` con `Offer` (prezzo, EUR, disponibilità, spedizione), `brand`, immagini;
   - cocktail: `Recipe`;
   - eventi club: `Event`;
   - `/dove-provarci`: `ItemList` di locali;
   - pagine con FAQ: `FAQPage`.
7. `noindex` su `/carrello` e `/ordine-ricevuto`.
8. Verificare il dominio in **Google Search Console** (proprietà dominio), inviare la sitemap, chiedere l'indicizzazione di home e pagine shop, rimuovere `checkout.mundogin.com`. Fare lo stesso su **Bing Webmaster Tools** (alimenta ChatGPT e Copilot).
9. Installare **GA4** (o Vercel Analytics) con eventi `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.
10. Aprire o completare il **Google Business Profile** e il **Merchant Center** (schede prodotto gratuite in Google Shopping).

### Fase 2 — On-page e contenuti (2–4 settimane)
11. Riscrivere gli H1 con la parola chiave: home "Mundo Gin — il gin italiano al caffè"; prodotto "Mundo Gin – Italian Coffee Dry Gin 70 cl"; shop in italiano.
12. Portare la pagina prodotto a 600–800 parole: note di degustazione, gradazione, botaniche, caffè usato, come si beve, toniche consigliate, FAQ (spedizione, tempi, reso, regalo).
13. Una pagina per ogni cocktail (`/cocktail/mundo-tonic`, ecc.) con ingredienti, dosi, procedimento, foto e schema `Recipe`. Obiettivo: "gin tonic al caffè", "negroni al caffè", "espresso martini con gin".
14. Creare una sezione guide/blog con 6–8 articoli mirati, per esempio:
    - "Gin al caffè: cos'è, come si produce, come si beve"
    - "I migliori gin al caffè italiani" (confronto onesto che include i concorrenti)
    - "Quale tonica abbinare a un gin al caffè"
    - "Gin tonic al caffè: la ricetta"
    - "Idee regalo per chi ama il gin" (stagionale: Natale, festa del papà)
    - "London Dry: cosa significa"
15. Pagine locali da `/dove-provarci`: "Dove bere Mundo Gin a Milano / Bergamo / Crema / Jesolo".
16. Ottimizzare le immagini: passare a `next/image`, convertire in WebP/AVIF, eliminare i file da più MB, alt descrittivi ovunque, nomi file senza spazi.
17. Versione inglese `/en` con `hreflang` (seconda priorità, utile per "Italian coffee gin").

### Fase 3 — Autorevolezza e GEO (continuativo)
18. Farsi schedare e recensire dove Google e le AI già pescano: **ilGin.it**, **Ginferno**, Bevo.it (aggiornare la scheda), Gin Foundry, Untappd per la birra.
19. Digital PR: comunicati e campioni a Beverfood, Bargiornale, Dissapore, Scatti di Gusto, Gambero Rosso, testate locali di Bergamo e Milano. Ogni articolo con link al sito.
20. Chiedere un link dai siti dei locali partner elencati in `/dove-provarci` e dal torrefattore del caffè.
21. Partecipare a concorsi (IWSC, World Gin Awards, Concours Mondial): le medaglie generano pagine terze, citazioni e fiducia.
22. Marketplace: Amazon, Tannico, Callmewine, Bottle of Italy. Occupano i risultati transazionali che il sito da solo non raggiungerà a breve.
23. Aggiungere `llms.txt` e una pagina "Scheda prodotto / Press" con i fatti in forma secca (produttore, luogo, gradazione, formato, prezzo, botaniche, premi).
24. Coerenza del nome ovunque: "Mundo Gin – Italian Coffee Dry Gin" identico su sito, Instagram, Google Business, schede di terzi.

### Fase 4 — Conversione
25. Dichiarare **costo e tempi di spedizione** in pagina prodotto e carrello (oggi "Spedizione calcolata al checkout"). Una bottiglia costa €45 e la soglia gratuita è €50: valutare soglia a €45 o un bundle che la superi (gin + toniche, gin + 4 birre, 2 bottiglie).
26. **Recensioni** verificate in pagina prodotto (con `AggregateRating` nello schema).
27. **Cattura email**: sconto di benvenuto o iscrizione Mundo Club, più recupero carrello abbandonato.
28. Confezione regalo e messaggio personalizzato, soprattutto da novembre a dicembre.
29. Portare chi arriva dagli eventi Mundo Club verso lo shop: codice sconto nella mail di conferma iscrizione e QR ai tavoli.
30. Segnali di fiducia vicino al pulsante d'acquisto: pagamenti accettati, reso, contatto WhatsApp.

## 7. Parole chiave obiettivo

| Tipo | Query | Pagina |
|---|---|---|
| Brand | mundo gin, mundogin, mundo gin caffè, mundo beer | Home, prodotto |
| Categoria | gin al caffè, coffee gin, gin al caffè italiano, gin con caffè | Prodotto + guida |
| Transazionale | gin al caffè acquista online, gin artigianale italiano online, gin regalo | Prodotto, shop |
| Ricette | gin tonic al caffè, negroni al caffè, espresso martini gin | Pagine cocktail |
| Informative | migliori gin al caffè, quale tonica gin al caffè, london dry significato | Guide |
| Locali | dove bere gin Milano/Bergamo, cocktail bar + città | Pagine locali |

Concorrenti diretti osservati nei risultati: 400 Conigli Coffee Gin (Volume 1), Il Gin del Baffo (Caffè Agust), Distillerie Peroni Maddalena Gin al Caffè, Coffee Gin di Essense, Gin del CoffeeMaker "L'Etiope", Buosi (Pallini), Elephant Gin Coffee Liqueur, Nikka Coffey Gin.

## 8. Metriche da seguire

- Search Console: pagine indicizzate (obiettivo: tutte le pubbliche entro 4 settimane), posizione per "mundo gin" (obiettivo: 1ª entro 4–8 settimane), impression e clic non-brand.
- GA4: sessioni organiche, tasso di aggiunta al carrello, tasso di conversione, valore medio ordine.
- GEO: una volta al mese chiedere a ChatGPT, Perplexity e Gemini "qual è un buon gin al caffè italiano?" e "cos'è Mundo Gin?" e annotare se e come viene citato.
- Numero di domini terzi che linkano il sito.

## 9. Aspettative realistiche

- Fase 1: effetto su indicizzazione e ricerche brand in 2–6 settimane.
- Query di categoria ("gin al caffè"): 3–6 mesi, solo con contenuti e link di terzi.
- Con poche visite la SEO da sola non basta nel breve: marketplace, PR, eventi e Meta Ads restano i canali che portano traffico subito, e la SEO li rende più efficienti.
