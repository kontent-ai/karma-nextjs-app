## What this project is

A Next.js sample app on top of Kontent.ai. Mirrors the Karma healthcare site as an integration reference: Delivery SDK, Draft Mode preview, Smart Link in-context editing, multi-environment preview via Auth0.

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/` — your training data is outdated.

## Tooling

- **npm only** — `npm ci` / `npm install`, never yarn or pnpm.
- After changing code: `npm run biome:fix` (format + safe fixes), then `npm run lint` (ESLint catches what Biome doesn't). Both must pass.
- `npm run dev`; `npm run dev:https` when a flow needs HTTPS (session cookie, preview iframe).
- `npm run model:generate` regenerates `src/model/` from the content model; prefer regenerating to hand-editing.

## Architecture

### Two route trees

Both trees live under `src/app/[locale]/` (next-intl) and render the same screens from `src/components/screens/`:

- **Default tree** (`src/app/[locale]/`) — primary environment. Delivery key from `KONTENT_DELIVERY_API_KEY` via `getDefaultEnv()`. ISR (`revalidate = 300`).
- **Tenant tree** (`src/app/[locale]/envid/[envId]/`) — previews any other environment the signed-in user can access. Each page exports `dynamic = "force-dynamic"`; key resolved per request via `resolveApiKey()`.

Screens take `{ envId, apiKey, isPreviewEnabled, locale }` — keep that contract intact.

### Auth & multi-environment preview

- `src/proxy.ts` (Next.js proxy, formerly middleware) gates `/[locale]/envid/...` — unauthenticated requests redirect to `/auth/login`.
- Auth0 is a **public client (PKCE, no client secret)**. Flow in `src/lib/auth0/flows.ts` (`buildAuthorizationUrl`, `handleCallback`, `buildLogoutUrl`).
- On callback, the Auth0 access token is exchanged via Kontent's internal admin API (`src/lib/kontentInternalApi/`, not the public Management API) for the env's Delivery preview key, cached in an encrypted `iron-session` cookie (`src/lib/auth0/session.ts`).

### Draft Mode & Smart Link

- Preview = Next.js Draft Mode. Toggle via `/api/preview/{enable,disable}`; read with `draftMode()`.
- `isPreviewEnabled` flows into `getDeliveryClient` (`src/utils/client.server.ts`) to switch between published and preview content.
- `SmartLinkProvider` mounts in the root layout when Draft Mode is on. `SmartLinkEnvironment` (per env + locale config) mounts inside each `*Preview.tsx`, so Smart Link only activates on landing and detail screens — **not on index screens, by design**.

### Conventions

- `*.server.ts` suffix marks server-only modules (e.g. `src/utils/client.server.ts`); don't import them into client components.
- Path alias `@/*` → `src/`. Imports include the file extension (`.ts` / `.tsx`).
- `src/components/screens/` = full-page compositions; `src/components/` = reusable pieces; `src/lib/` = non-UI logic.
- Detail and landing screens use a triplet: `Xxx.tsx` (server, fetches via `src/lib/screens/` loader), `XxxView.tsx` (presentational), `XxxPreview.tsx` (client, Smart Link live updates). Index screens are single server components.
- No barrel files except deliberate public API.

## Code style

Match surrounding files. Core rules:

- **Functional style over OOP** — pure functions, composition, immutable data; not classes.
- **`const` over `let`** unless reassignment is genuinely required.
- **Boolean names start with `is`/`has`/`can`/`should`/`was`** (e.g. `isPreviewEnabled`).
- **No `return` on the same line as a condition** — use a block.
- **Comments only when they add non-obvious value** — explain *why*, not *what*.
- No emojis in code, comments, or docs.
- Props types are `Readonly<{ ... }>`.
