# Agent Notes

This is a real product repository for the GCSE Russian course platform.

- Never commit `.env.local`, secrets, service-role keys, Stripe secrets, private student data, parent contact data, teacher notes, Supabase exports, or production billing records.
- Keep public/product copy GCSE Russian-specific unless the task explicitly scopes work to another Volna learning experience.
- Prefer existing domain helpers and documented architecture before adding new patterns.
- Use `npm run lint`, relevant tests, and `npm run build` before opening PRs or committing production-facing changes.

## Dev Server Workflow

- The local dev server is pinned to `http://localhost:3030` via `npm run dev`.
- On Windows, prefer `npm.cmd run dev` from the Codex integrated terminal.
- If `3030` is already in use, check whether this project is already running and reuse that server instead of starting a second copy.
- Do not let Next.js silently pick a different port for this project; resolve the port conflict so Codex browser QA and chat references stay stable.
- Recommended Codex Local Environment action: `Run` -> `npm.cmd run dev`.
- Recommended Codex Local Environment setup script: `npm install`.
