## What this project is

A Next.js sample app on top of Kontent.ai. It mirrors the Karma healthcare site and exists as an integration reference: Delivery SDK usage, Draft Mode preview, Smart Link in-context editing, and multi-environment preview via Auth0.

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

## Tooling

- Package manager is **npm**. Use `npm ci` / `npm install`, never yarn or pnpm.
- After changing code, run **`npm run biome:fix`** to format and apply safe lint fixes, then **`npm run lint`** (ESLint) to catch what Biome does not. Both must pass before considering work done.
- `npm run dev` for the dev server; `npm run dev:https` when a flow needs HTTPS (session cookie, preview iframe).
- `npm run model:generate` regenerates `src/model/` from the Kontent.ai content model. Files in `src/model/` are generated, so prefer regenerating over hand-editing — but it is fine to edit them directly if the user explicitly asks.

## Architecture

### Two route trees

The app serves the same screens through two parallel route trees:

- **Default tree** (`src/app/page.tsx`, `src/app/blog/`, `src/app/research/`, `src/app/services/`, `src/app/our-team/`) — the primary Kontent.ai environment. Reads its delivery key from `KONTENT_DELIVERY_API_KEY` via `getDefaultEnv()`. Statically generated with ISR (`export const revalidate = 300`), preview always off.
- **Tenant tree** (`src/app/envid/[envId]/`) — previews any other environment the signed-in user can access. `export const dynamic = "force-dynamic"`, resolves the delivery key per request through `resolveApiKey()`, and reads Draft Mode state.

Both trees render the same components from `src/components/screens/`. Screens take `{ envId, apiKey, isPreviewEnabled }` props so they stay agnostic about which tree invoked them — keep that contract intact when editing screens.

### Auth & multi-environment preview

- `src/proxy.ts` (Next.js proxy/middleware) gates `/envid/:path*`. Unauthenticated requests are redirected to `/auth/login`.
- Auth0 is a **public client using PKCE** — there is no Auth0 client secret. Flow lives in `src/lib/auth0/flows.ts` (`buildAuthorizationUrl`, `handleCallback`, `buildLogoutUrl`).
- On callback, the Auth0 access token is exchanged via the Kontent.ai API (`src/lib/iapi/`) for the environment's Delivery preview key, cached on an encrypted `iron-session` cookie (`src/lib/auth0/session.ts`).
- The default environment never needs this — `isDefaultEnv()` short-circuits key resolution to env vars.

### Draft Mode & Smart Link

- Preview is driven by Next.js Draft Mode. `/api/preview/enable` and `/api/preview/disable` toggle it; `draftMode()` reads it.
- `isPreviewEnabled` flows from the route into the delivery client (`getDeliveryClient` in `src/utils/client.server.ts`) to switch between published and preview content.
- `src/components/SmartLinkProvider.tsx` is a client component mounted by the tenant layout **only when Draft Mode is enabled**.

### Conventions

- `*.server.ts` suffix marks server-only modules (e.g. `src/utils/client.server.ts`). Do not import them into client components.
- Path alias `@/*` maps to `src/`. Imports include the file extension (`.ts` / `.tsx`).
- `src/components/screens/` holds full-page compositions; `src/components/` holds reusable pieces; `src/lib/` holds non-UI logic (auth, env, i18n, Kontent.ai API).
- No barrel files except a deliberate public API.

## Code style

Write code that matches the surrounding files. Core rules:

- **Functional style over OOP.** Prefer pure functions, composition, and immutable data over classes.
- **`const` over `let`** unless reassignment is genuinely required.
- **Boolean names start with a helper verb** — `is` / `has` / `can` / `should` / `was` (e.g. `isPreviewEnabled`, `hasArtifacts`, `canRetry`). Applies to parameters, locals, fields, and object props.
- **Do not put `return` on the same line as a condition.** Use a block.
- **Comments only where they add non-obvious value** — explain *why*, not *what*. Skip narrating self-evident code.
- No emojis in code, comments, or docs.
- Props types are `Readonly<{ ... }>`; component prop objects are typed inline or as a local `Props` type.
