# Flux agent guidance

## Neon
- Follow `.agents/skills/neon/SKILL.md` before modifying Neon configuration, schemas, or authentication.
- For Postgres/schema tasks load the official `neon-postgres` skill; for login/sessions use `neon-auth`. Fetch current official instructions when needed.
- Reuse the existing `neon.ts`, `.neon`, and environment variables if present; never overwrite existing configuration blindly.
- Never commit `.env`, `.env.local`, database passwords or API keys.
- Use separate development branches for database/schema changes. Verify build and live flows before merging to main.
- The Neon MCP OAuth endpoint is `https://mcp.neon.tech/mcp`. Configure it in the actual agent client (not as an application runtime secret).
