[![MIT License][license-shield]][license-url]
[![Discord][discussion-shield]][discussion-url]

## About The Project

A Next.js sample project built on top of Kontent.ai. It mirrors the Karma healthcare site and serves as a reference for integrating Kontent.ai into a Next.js application.

## Demonstrated Kontent.ai Features

- **Delivery SDK** with strongly-typed content via generated models (`src/utils/client.server.ts`, `src/model/`)
- **Draft Mode preview** — uses Next.js Draft Mode to preview unpublished content. Toggle it through the `/api/preview/enable` and `/api/preview/disable` routes; while enabled, pages render preview data instead of published content.
- **Rich text rendering** with `@kontent-ai/rich-text-resolver-react` and custom Portable Text resolvers (`src/utils/richtext.tsx`)
- **Smart Link** in-context editing on the landing page and on detail pages for blog posts, services, research articles, and team members. The SDK is wired inside `*Preview.tsx` client components (`src/components/screens/`). Index pages intentionally have no Smart Link — editing happens on each item's detail route.
- **Taxonomy-based filtering** on the research listing page (`src/components/research/ArticleListWithFilters.tsx`)
- **App-wide localization** with `next-intl` under a `[locale]` segment; a global language switcher in the header swaps locales while preserving the current route (`src/components/LanguageSwitcher.tsx`).
- **Type generation** from the Kontent.ai content model (`scripts/generateModel.ts`)

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kontent-ai/karma-nextjs-app.git
   ```
2. Install dependencies
   ```sh
   npm ci
   ```
3. Create a `.env.local` file from `.env.template` and fill in the Kontent.ai and Auth0 values. At minimum you need `KONTENT_ENVIRONMENT_ID`, `KONTENT_DELIVERY_API_KEY`, `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `APP_BASE_URL`, and `SESSION_PASSWORD`.
4. Run the app
   ```sh
   npm run dev
   ```

## Removing the multi-environment preview

If you only need the single default environment, you can strip the Auth0 layer out:

- Delete the `src/app/[locale]/envid/` route tree, `src/app/auth/`, `src/app/callback/`, `src/lib/auth0/`, `src/lib/kontentInternalApi/`, `src/lib/env/resolveApiKey.ts`, `src/lib/sanitizeReturnTo.ts`, and `src/proxy.ts`.
- Replace `src/components/EnvLink.tsx` with a plain `next/link`, and remove the `/envid/` prefix handling from `src/components/Header.tsx` and `src/components/Navigation.tsx`.
- Drop the Auth0 variables from `.env.template` and uninstall the now-unused `iron-session` and `openid-client` dependencies.

## Regenerating the Model

After updating the content model in Kontent.ai, regenerate the TypeScript models with the [Kontent.ai Model Generator](https://github.com/kontent-ai/model-generator-js):

```sh
npm run model:generate
```

> [!NOTE]
> Ensure `.env.local` contains `KONTENT_ENVIRONMENT_ID` and `KONTENT_MANAGEMENT_API_KEY`.

## HTTPS dev server

Some flows require HTTPS in development — most notably the session cookie, which uses `SameSite=None; Secure` so it works inside the Kontent.ai preview iframe. Run:

```sh
npm run dev:https
```

This starts Next.js with [`--experimental-https`](https://nextjs.org/docs/app/api-reference/cli/next#using-https-during-development), generating a local certificate so the dev server is served over HTTPS.

## Contributing

For Contributing please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for more information.

## License

Distributed under the MIT License. See [`LICENSE.md`](./LICENSE.md) for more information.

[license-shield]: https://img.shields.io/github/license/kontent-ai/karma-nextjs-app.svg?style=for-the-badge
[license-url]: https://github.com/kontent-ai/karma-nextjs-app/blob/main/LICENSE.md
[discussion-shield]: https://img.shields.io/discord/821885171984891914?color=%237289DA&label=Kontent%2Eai%20Discord&logo=discord&style=for-the-badge
[discussion-url]: https://discord.com/invite/SKCxwPtevJ
