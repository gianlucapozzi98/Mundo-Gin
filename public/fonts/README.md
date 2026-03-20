# Font Futura PT (400 e 500)

Per usare **Futura PT** sul sito hai due possibilità.

## 1. Adobe Fonts (Typekit)

1. Vai su [fonts.adobe.com](https://fonts.adobe.com), crea un Web Project e aggiungi **Futura PT** (pesi Book e Medium).
2. Copia l’ID del kit (es. `abc1xyz` dall’URL `https://use.typekit.net/abc1xyz.css`).
3. Nel progetto crea un file `.env.local` con:
   ```env
   NEXT_PUBLIC_TYPEKIT_ID=abc1xyz
   ```
4. Riavvia il dev server. Il font verrà caricato da Adobe.

## 2. Font locali (woff2)

Se hai i file **Futura PT** in licenza, metti in questa cartella:

- `futura-pt-book.woff2` (peso 400)
- `futura-pt-medium.woff2` (peso 500)

Il sito li userà tramite gli `@font-face` definiti in `app/globals.css`.  
Se usi solo Typekit puoi lasciare la cartella vuota (vedrai in console richieste 404 per questi file, innocue).
