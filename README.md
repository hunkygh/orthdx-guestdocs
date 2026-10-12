# Guestdocs by ORTHDX

Next.js, Tiptap and Supabase proof-of-concept for no-account document collaboration.

## Setup
1. Run `supabase/schema.sql` in a Supabase project.
2. In the ORTHDX Vercel team import this repository. Set the **production branch to main**, and enable preview deployments only if desired.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a strong `OWNER_SETUP_SECRET` in Vercel.
4. Run `npm install`, `npm run typecheck`, and `npm run build` before treating this as production ready.
5. Open `/dashboard`, enter setup secret, and create a document. Securely save the resulting owner URL.

## Limitations
**Development MVP only.** No real-time CRDT multi-user merging, authentication, account library, persistent session, external imports, or provider sync. Suggestions can be reviewed but accepted suggestions are not automatically inserted. URL bearer tokens can leak through sharing/history; do not use confidential content before strengthening security. No rate limiting or identity verification. Guest names are self-declared. Never put the service-role key in client-side code.
