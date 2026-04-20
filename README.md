# Malik Laing — Portfolio

Next.js (App Router) photography portfolio. **Only the gallery photos are
managed through Sanity CMS** — tagline, bio, brand, metadata, and every
other string live in the codebase.

## Stack

- Next.js 16 + React 19 + Tailwind v4
- Sanity v3 (embedded Studio at `/studio`)
- Content model: one `homePage` singleton containing an ordered array of
  `galleryPhoto` objects (title / description / year / image).

## Local dev

```bash
npm install
npm run dev            # http://localhost:3001
# Studio: http://localhost:3001/studio
```

If `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set, the site falls back to the
bundled local copy (`app/photoMetadata.json` + `public/ML-photos`) so the
UI still renders.

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable                          | Required where | Notes |
|-----------------------------------|----------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | local + Vercel | Public; from sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET`      | local + Vercel | `production` |
| `SANITY_TOKEN`                    | local only     | Editor token for `npm run seed:sanity` and `npm run cleanup:sanity`. **Do not** add to Vercel. |

## Sanity setup (one-time)

1. Create a project at [sanity.io/manage](https://sanity.io/manage). Note the project ID.
2. In that project → **API** → **CORS origins**, add (with "Allow credentials" enabled):
   - `http://localhost:3001`
   - `https://<your-vercel-domain>`
3. In **API** → **Tokens**, create a token with role **Editor**. Copy it to `.env.local` as `SANITY_TOKEN`.
4. Seed the dataset from the current local assets:

   ```bash
   npm run seed:sanity
   ```

   This uploads every photo in `public/ML-photos/` (ordered by
   `data/photoOrder.ts`) and creates the `homePage` document. Safe to
   re-run — it upserts.

5. Open `/studio` to edit captions / reorder / add photos.

## Editor model

- **Gallery** (the only Studio entry) — an ordered array of photos. Each
  photo has:
  - **Title** — first caption line (e.g. "Dae").
  - **Description** — location shown before the year (e.g. "Redlands").
  - **Year** — integer, shown after the description.
  - **Image** — uploaded asset; hotspot/crop supported.

  Drag to reorder. The front-end renders captions as
  `description, year` to preserve the original look.

## Deploy

Add the two public `NEXT_PUBLIC_SANITY_*` vars to Vercel Project Settings →
Environment Variables. Deploy as normal. The Studio at `/studio` is served
from the same deployment.

## Dev-server note

`package.json`'s `dev` script sets `WATCHPACK_POLLING=true` to avoid
macOS `kqueue` exhaustion from the Sanity dep tree — without it, Next's
Turbopack can silently fail to index routes and return 404s for every page.
