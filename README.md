[![MIT License][license-shield]][license-url]
[![Discord][discussion-shield]][discussion-url]

## About The Project

A React sample project built on top of Kontent.ai. It mirrors the Karma healthcare site and serves as a reference for integrating Kontent.ai into a React application.

## Demonstrated Kontent.ai Features

- **Delivery SDK** with strongly-typed content via generated models (`src/utils/client.ts`)
- **Preview mode** toggle for previewing unpublished content
- **Rich text rendering** with `@kontent-ai/rich-text-resolver-react` and custom Portable Text resolvers (`src/utils/richtext.tsx`)
- **Smart Link** integration for in-context editing, live preview, and custom refresh hooks (`src/context/SmartLinkContext.tsx`)
- **Taxonomy-based filtering** on the articles listing page (`src/pages/ArticlesListingPage.tsx`)
- **Language switching** on article detail pages (`src/pages/ArticleDetailPage.tsx`)
- **Type generation** from the Kontent.ai content model (`scripts/generateModel.ts`)

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kontent-ai/karma-sample-project.git
   ```
2. Install dependencies
   ```sh
   npm ci
   ```
3. Create a `.env.local` file from `.env.template` and fill in `VITE_ENVIRONMENT_ID` and `VITE_DELIVERY_API_KEY`.
4. Run the app
   ```sh
   npm run dev
   ```

## Regenerating the Model

After updating the content model in Kontent.ai, regenerate the TypeScript models with the [Kontent.ai Model Generator](https://github.com/kontent-ai/model-generator-js):

```sh
npm run model:generate
```

> [!NOTE]
> Ensure `.env.local` contains `VITE_ENVIRONMENT_ID` and `VITE_MANAGEMENT_API_KEY`.

## HTTPS dev server

Some flows require HTTPS in development. Run:

```sh
npm run dev:https
```

This starts Vite with `--mode=https`, so any variables in `.env.https.local` override `.env.local` for that session. Use it to set HTTPS-specific values such as `VITE_AUTH_REDIRECT_URL=https://localhost:3000/callback`.

## Contributing

For Contributing please see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for more information.

## License

Distributed under the MIT License. See [`LICENSE.md`](./LICENSE.md) for more information.

[license-shield]: https://img.shields.io/github/license/kontent-ai/karma-sample-project.svg?style=for-the-badge
[license-url]: https://github.com/kontent-ai/karma-sample-project/blob/main/LICENSE.md
[discussion-shield]: https://img.shields.io/discord/821885171984891914?color=%237289DA&label=Kontent%2Eai%20Discord&logo=discord&style=for-the-badge
[discussion-url]: https://discord.com/invite/SKCxwPtevJ
