# Guestdocs — ORTHDX
A Next.js + Tiptap + Supabase proof-of-concept. Open /dashboard to create documents, without a setup-secret prompt.

## Setup
- Create Supabase project and execute `supabase/schema.sql`.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your ORTHDX Vercel project.
- Vercel production branch: main.
- `npm install && npm run typecheck && npm run build`.

## Caveats
This is a development prototype, **not a production-ready multi-tenant workspace**. Document creation is publicly accessible and could be abused. Workspace project organization and the owner-token library are **browser-local**, not multi-device or synced. Browser storage loss means lost owner access unless the owner URL is saved. Tokens in URLs are sensitive. Owner account authentication, anti-abuse limits, server-backed projects/workspace membership, secure guest sessions and real-time multiplayer editing must be completed before public launch. Suggestions are not automatically applied. Never expose Supabase's service-role key in client code.
## Editor components
Tiptap StarterKit is open source and requires **no API key**. Cloud-hosted Tiptap collaboration/AI or external APIs may need separate accounts/keys. The gradient here is CSS, no Three.js requirement or key.
