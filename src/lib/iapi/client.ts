import {
  type BaseUrl,
  getDefaultHttpService,
  type SdkConfig,
  type SdkInfo,
} from "@kontent-ai/core-sdk";

const KONTENT_HOST = process.env.NEXT_PUBLIC_KONTENT_URL ?? "kontent.ai";

const sdkInfo: SdkInfo = {
  name: "karma-nextjs-app",
  version: "0.0.0",
  host: "npmjs.com",
};

const baseUrl: BaseUrl = {
  protocol: "https",
  host: `app.${KONTENT_HOST}`,
};

export const iapiUrl = (base: BaseUrl, path: string): URL =>
  new URL(path, `${base.protocol}://${base.host}`);

export type IapiClient = Readonly<{
  config: SdkConfig;
  sdkInfo: SdkInfo;
  urlBase: BaseUrl;
  token: string;
}>;

export const createIapiClient = (token: string): IapiClient => ({
  config: {
    baseUrl,
    httpService: getDefaultHttpService({
      retryStrategy: { maxRetries: 3, canRetryAdapterError: () => true },
    }),
  },
  sdkInfo,
  urlBase: baseUrl,
  token,
});
