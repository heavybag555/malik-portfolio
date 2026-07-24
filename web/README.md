# Malik Laing — Portfolio (web)

Next.js (App Router) photography portfolio. **All editorial content —
gallery photos, the Info page bio/portrait, and site-wide brand/contact/
tagline copy — is managed through Sanity CMS.** Nothing user-facing is
hardcoded in the codebase.

This is the `web/` app of the `maliklphoto.xyz` monorepo. The Sanity Studio
lives standalone in the sibling `../studio` folder — see its README for
schema/content-model details.

## Stack

- Next.js 16 + React 19 + Tailwind v4
- `next-sanity` + `@sanity/client` for content fetching (no embedded Studio)
- Content model (defined in `../studio/schemaTypes`):
  - `homePage` singleton — ordered array of `galleryPhoto` objects (title / description / year / image)
  - `infoPage` singleton — portrait, bio paragraphs, Instagram handle/URL
  - `siteSettings` singleton — brand name/suffix, contact email, tagline, copyright, SEO title/description

## Local dev

Run the app and the Studio side by side, in separate terminals:

```bash
npm install
npm run dev              # web app → http://localhost:3001

cd ../studio
npm install
npm run dev              # Studio  → http://localhost:3333
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

The Sanity project (`ko5xg1lg` / dataset `production`) and Studio already
exist in `../studio`. To connect a fresh checkout of this app to it:

1. Add this app's origin to the project's CORS origins (with "Allow
   credentials" enabled), either via `npx sanity cors add <url> --credentials`
   from `../studio`, or in [sanity.io/manage](https://sanity.io/manage):
   - `http://localhost:3001`
   - `https://<your-vercel-domain>`
2. In **API** → **Tokens**, create a token with role **Editor** and copy it
   to `.env.local` as `SANITY_TOKEN` (or run
   `npx sanity tokens create "seed-sanity" --role=editor` from `../studio`).
3. Seed the dataset from the local launch assets (safe to re-run — it upserts):

   ```bash
   npm run seed:sanity
   ```

   This uploads every photo in `public/ML-photos/` plus the portrait in
   `public/malik-info.jpg`, and creates the `homePage`, `infoPage`, and
   `siteSettings` documents with the site's original copy.
4. Open the Studio (`npm run dev` in `../studio`, or its deployed URL) to
   add / edit content.

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
Environment Variables and deploy as normal. Deploy the Studio separately
(`npx sanity deploy` from `../studio`) — it's no longer part of this app's
build.

## Dev-server note

`package.json`'s `dev` script sets `WATCHPACK_POLLING=true` to avoid macOS
`kqueue` exhaustion during local development — without it, Next's Turbopack
can silently fail to index routes and return 404s for every page.
