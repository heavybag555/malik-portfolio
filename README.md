# maliklphoto.xyz

Monorepo for Malik Laing's photography portfolio.

```
maliklphoto.xyz/
├── studio/   # Standalone Sanity Studio (content model + editor UI)
└── web/      # Next.js frontend
```

- **Sanity project:** `ko5xg1lg` (dataset: `production`)
- Run each app from its own folder — see `studio/README.md` (default Sanity
  scaffold docs) and `web/README.md` (content model, env vars, seeding).

## Local dev

```bash
# Terminal 1
cd studio && npm run dev     # http://localhost:3333

# Terminal 2
cd web && npm run dev        # http://localhost:3001
```
