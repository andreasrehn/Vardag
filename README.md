# Vardagen

Kalender, kvitton och listor för familjen – och en privat del bara för dig.
Appen fungerar på svenska, norska, danska och engelska och anpassar sig efter hur man bor:
separerad med barn (även med ny partner), bor ensam, sambo och sambo med barn.

Det här är en webbapp som installeras på telefonens hemskärm. Den öppnas i helskärm med egen ikon,
precis som en vanlig app. Data sparas i Supabase (en databas i EU) och är kopplad till kontot,
så allt finns kvar om du byter telefon.

---

## Kom igång – steg för steg

Du behöver tre gratiskonton: **GitHub** (koden och webbadressen), **Supabase** (databas och inloggning)
och, senare, **Expo** (om appen ska till App Store). Räkna med cirka 20 minuter.

### 1. Supabase – databasen

1. Gå till [supabase.com](https://supabase.com) och skapa ett konto.
2. Klicka **New project**.
   - Namn: `Vardagen`
   - Database password: hitta på ett starkt lösenord och spara det i din lösenordshanterare.
   - Region: **North EU (Stockholm)**.
3. När projektet är klart: öppna **SQL Editor** i vänstermenyn → **New query**.
   Klistra in hela innehållet i filen [`supabase/schema.sql`](supabase/schema.sql) och tryck **Run**.
   Det ska stå *Success. No rows returned*.
4. Öppna **Authentication → Sign In / Providers → Email**:
   - **Enable Email provider**: på.
   - **Confirm email**: *av* medan ni testar (se *E-post* nedan), på inför lansering.
   - **Minimum password length**: `10`.
5. Öppna **Authentication → URL Configuration**:
   - **Site URL**: din app-adress från steg 2 nedan, t.ex. `https://dittnamn.github.io/vardagen/`
   - **Redirect URLs**: lägg till samma adress.
6. Hämta adressen och nyckeln:
   - **Adressen**: **Project Settings → Data API** → *Project URL*, t.ex. `https://abcdefgh.supabase.co`
     (utan `/rest/v1/` på slutet).
   - **Nyckeln**: **Project Settings → API Keys** → fliken **Legacy API Keys** → raden **anon public** → **Copy**.
     Den börjar med `eyJ`. Finns inte fliken kan du i stället kopiera **Publishable key** (börjar med `sb_publishable_`).

   Skriv in dem i filen [`config.js`](config.js):

   ```js
   window.VARDAGEN_CONFIG = {
     supabaseUrl: "https://abcdefgh.supabase.co",
     supabaseAnonKey: "eyJhbGciOi..."
   };
   ```

   Anon-nyckeln är gjord för att synas i appen. Allt skyddas av reglerna i `schema.sql`:
   privata data kan bara läsas av ägaren, och delade data bara av medlemmarna i just det utrymmet.
   Använd **aldrig** nyckeln som heter *service_role* eller *Secret key* i appen.

### 2. GitHub Pages – webbadressen

1. Lägg koden i ett repository på GitHub, t.ex. `vardagen`.
2. Öppna repositoryt → **Settings → Pages**.
3. **Source**: *Deploy from a branch*. **Branch**: `main`, mapp `/ (root)`. Tryck **Save**.
4. Efter någon minut finns appen på `https://<ditt-github-namn>.github.io/vardagen/`.

GitHub Pages är gratis för publika repositories. Koden syns då för andra, men ingen data –
den ligger i Supabase. Vill du ha koden privat går det lika bra att använda Netlify, Vercel
eller Cloudflare Pages som också är gratis.

### 3. På iPhone

1. Öppna app-adressen i **Safari**.
2. Tryck på **Dela**-knappen (fyrkanten med pilen) → **Lägg till på hemskärmen** → **Lägg till**.
3. Öppna **Vardagen** från hemskärmen och skapa ett konto.

### 4. Bjud in andra

- **Familjen**: Familjen → *Barn & föräldrar* → **Skapa inbjudningslänk**. Skicka länken till barnens andra förälder.
- **Hemmet** (separerad med ny partner): Hemmet → *Vi två* → **Skapa inbjudningslänk**. Skicka till din partner.

En länk gäller i 14 dagar, kan användas en gång och ger bara tillgång till det utrymmet.
Det som ligger under **Mitt** ser bara du.

---

## E-post

Supabase skickar e-post (bekräftelse och glömt lösenord) via sin egen server, som bara får
skicka till adresser i ditt eget Supabase-team och bara ett fåtal per timme. Därför:

- **Medan ni testar**: stäng av *Confirm email*, så kan alla skapa konto direkt.
- **Inför lansering**: lägg in en egen e-posttjänst under **Authentication → Emails → SMTP Settings**,
  t.ex. [Resend](https://resend.com) eller [Brevo](https://brevo.com) (båda har gratisnivåer).
  Slå sedan på *Confirm email* igen.

---

## Så är appen byggd

| Fil | Vad den gör |
| --- | --- |
| `index.html` | Sidan som öppnas. Laddar resten. |
| `app.js`, `app.css` | Hela appen: vyer, funktioner och de fyra språken. |
| `backend.js` | Inloggning med e-post och lösenord, utrymmen, inbjudningar och lagring i Supabase. |
| `config.js` | Adressen och den publika nyckeln till ditt Supabase-projekt. |
| `supabase/schema.sql` | Tabeller, behörighetsregler och funktioner i databasen. |
| `manifest.webmanifest`, `icons/`, `sw.js` | Gör att appen kan läggas på hemskärmen och startar snabbt. |
| `vendor/supabase.js` | Supabase-biblioteket (version 2.45.4). |
| `tests/` | Automatiska tester (se nedan). |

**Utrymmen.** All delad data hör till ett *utrymme* med en egen medlemslista: Familjen (med barnens
andra förälder) eller Hemmet (med en sambo eller ny partner). Den som är med i båda ser båda, men
ditt ex och din partner ser aldrig varandras utrymmen. Den privata delen, Mitt, har bara dig som medlem.
Reglerna finns i databasen, så de gäller oavsett vad appen gör.

**Ny partner och barnens schema.** Om du är med i både Familjen och Hemmet kopierar appen vilka dagar
barnen bor hos dig till Hemmet, så att din partner kan planera. Inget annat från Familjen följer med.

---

## Tester

```bash
npm install
npm run test:server &   # startar en testserver som efterliknar Supabase på port 8787
npm run test:e2e        # tre personer: du, barnens andra förälder och din nya partner
npm run test:demo       # alla funktioner, alla boendeformer, fyra språk, ljust och mörkt läge
npm run test:db         # behörighetsreglerna i schema.sql, mot en riktig Postgres (PGlite)
```

---

## Inte med än

- **AI** (läsa kvitton, middagstips, smartare snabbinmatning). Appen fungerar utan; kvitton skrivs in för hand.
  AI läggs till via en Supabase Edge Function som anropar Anthropics API, så att nyckeln aldrig finns i appen.
- **Push-notiser** till telefonen. Notiser syns i appen. Webb-push på iPhone kräver iOS 16.4 eller senare och
  att appen ligger på hemskärmen.
- **App Store**. Samma kod kan paketeras med Expo/Capacitor när ni är nöjda med testerna.
- **Radera konto** inifrån appen (görs tills vidare i Supabase-panelen).
