# Malik Laing — Portfolio

Next.js (App Router) photography portfolio. **All editorial content —
gallery photos, the Info page bio/portrait, and site-wide brand/contact/
tagline copy — is managed through Sanity CMS.** Nothing user-facing is
hardcoded in the codebase.

## Stack

- Next.js 16 + React 19 + Tailwind v4
- Sanity v5 (embedded Studio at `/studio`)
- Content model:
  - `homePage` singleton — ordered array of `galleryPhoto` objects (title / description / year / image)
  - `infoPage` singleton — portrait, bio paragraphs, Instagram handle/URL
  - `siteSettings` singleton — brand name/suffix, contact email, tagline, copyright, SEO title/description

## Local dev

```bash
npm install
npm run dev            # http://localhost:3001
# Studio: http://localhost:3001/studio
```

If `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set, the gallery renders empty and
the Info page / site chrome fall back to the site's original launch copy so
the UI never looks broken.

## Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable                          | Required where | Notes |
|-----------------------------------|----------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | local + Vercel | Public; from sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET`      | local + Vercel | `production` |
| `SANITY_TOKEN`                    | local only     | Editor token for `npm run seed:sanity`. **Do not** add to Vercel. |

## Sanity setup

1. Create a project at [sanity.io/manage](https://sanity.io/manage). Note the project ID.
2. In that project → **API** → **CORS origins**, add (with "Allow credentials" enabled):
   - `http://localhost:3001`
   - `https://<your-vercel-domain>`
3. In **API** → **Tokens**, create a token with role **Editor** and copy it to `.env.local` as `SANITY_TOKEN`.
4. Seed the dataset from the current local assets (safe to re-run — it upserts):

   ```bash
   npm run seed:sanity
   ```

   This uploads every photo in `public/ML-photos/` plus the portrait in
   `public/malik-info.jpg`, and creates the `homePage`, `infoPage`, and
   `siteSettings` documents with the site's original copy.
5. Open `/studio` to add / edit content.

## Editor model

- **Gallery** — an ordered array of photos. Each photo has:
  - **Title** — first caption line (e.g. "Dae").
  - **Description** — location shown before the year (e.g. "Redlands").
  - **Year** — integer, shown after the description.
  - **Image** — uploaded asset; hotspot/crop supported.

  Drag to reorder. The front-end renders captions as
  `description, year` to preserve the original look.
- **Info Page** — portrait image + alt text, an ordered list of bio
  paragraphs, and the Instagram handle/URL shown on the Info page.
- **Site Settings** — brand name + italic suffix (header/nav), contact
  email, the two-part footer tagline (lead text + italic accent), the
  footer copyright line, and the browser tab title/description.

## Deploy

Add the two public `NEXT_PUBLIC_SANITY_*` vars to Vercel Project Settings →
Environment Variables. Deploy as normal. The Studio at `/studio` is served
from the same deployment.

## Dev-server note

`package.json`'s `dev` script sets `WATCHPACK_POLLING=true` to avoid
macOS `kqueue` exhaustion from the Sanity dep tree — without it, Next's
Turbopack can silently fail to index routes and return 404s for every page.
