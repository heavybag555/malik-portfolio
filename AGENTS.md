## Learned User Preferences

- Wants CMS/infra migrations (e.g. the Sanity migration) to leave the frontend visually and organizationally identical unless explicitly approved — preserve exact design, IA, routes, and behavior when refactoring internals.
- Prefers scope kept tight: only change exactly what was requested (e.g. "i just want the images in the cms, nothing else"), not adjacent behavior.
- Prefers all configurable design values (e.g. text/typography styles) centralized in one place (`app/globals.css`) with simple, "dumb" ascending naming, rather than scattered inline styles across components.
- Wants UI icons implemented as real SVG components, not unicode/text glyph characters.
- Often reports "changes not showing" after an edit — verify changes actually render (check in Browser, rule out stale dev server/cache/build issues) before declaring a task done.

## Learned Workspace Facts

- This is a Next.js photography portfolio site for photographer/director Malik Laing (San Bernardino, California), deployed on Vercel at maliklphoto.xyz. GitHub repo: `heavybag555/malik-portfolio`.
- Site layout uses a persistent 6-column grid (20px margin, 20px gutter) applied consistently across Home, Gallery, and Info pages.
- Fixed header/footer text uses `mix-blend-difference` blend-mode styling consistently on every page. Blend-mode elements must be siblings of fixed containers, not children nested inside a `fixed overflow-y-auto` parent — that nesting breaks blend-mode compositing on iOS Safari.
- All site typography is centralized in `app/globals.css` as ordered utility classes `.text-1`–`.text-5` (ascending by size); this is the single source of truth for text styles — avoid inline/one-off `text-[Npx]` styling.
- The accent serif style (`.text-4`) is Times New Roman bold italic, 15px — used only for specific accents like the year suffix and tagline accent text.
- Photo content is managed in Sanity CMS (Studio embedded in this repo under `sanity/`); only images (with title, description, year) live in Sanity — local image assets have been fully removed from `public/`.
- Next.js image optimization (`images.unoptimized` in `next.config.ts`) must stay enabled — disabling it previously caused ~584MB of unoptimized JPEGs to be served, badly hurting performance.
- `git push` on this machine requires SSH via `~/.ssh/id_ed25519_heavybag555` since the HTTPS `origin` remote has no cached keychain credentials; the GitHub repo owner account is `heavybag555`.
- Dev server occasionally fails to start/hot-reload due to a corrupted `node_modules/next` install; fix is `rm -rf node_modules/next .next && npm install`.
- `scripts/` holds one-off maintenance scripts (e.g. Sanity seeding) and is excluded from the Next.js TypeScript build via `tsconfig.json`'s `exclude`.
