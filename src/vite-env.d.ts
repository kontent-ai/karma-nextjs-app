/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT_ID?: string;
  readonly VITE_DELIVERY_API_KEY?: string;
  readonly VITE_AUTH_DOMAIN?: string;
  readonly VITE_AUTH_CLIENT_ID?: string;
  readonly VITE_AUTH_REDIRECT_URL?: string;
  readonly VITE_KONTENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
