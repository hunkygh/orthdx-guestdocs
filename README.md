# Flux — ORTHDX

Next.js + Tiptap, backed by Neon Postgres. The Neon Auth service is provisioned but **owner authentication is not yet integrated**; the existing bearer-link owner model remains a development prototype.

## Deployment
1. Project: `jolly-block-20460437`, branch: `production`. Schema: `neon/schema.sql` (already created on that branch).
2. Add the Neon pooled `DATABASE_URL` as a server-only secret in the ORTHDX Vercel project, then redeploy.
3. Run `npm install && npm run typecheck && npm run build`.

## Security limitations
Document creation is currently public and requires rate limits and authenticated owner accounts before launch. Projects and the document library are currently in browser localStorage, not Neon. Existing docs from Supabase have not been migrated. Link tokens must be kept secret. Full real-time collaboration and automated application of suggestions are not implemented.
