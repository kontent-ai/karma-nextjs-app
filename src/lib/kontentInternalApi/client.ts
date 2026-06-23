import {
  type BaseUrl,
  getDefaultHttpService,
  type SdkConfig,
  type SdkInfo,
} from "@kontent-ai/core-sdk";
import { kontentHost } from "@/utils/kontentHost.ts";

const sdkInfo: SdkInfo = {
  name: "karma-nextjs-app",
  version: "0.0.0",
  host: "npmjs.com",
};

const baseUrl: BaseUrl = {
  protocol: "https",
  host: `app.${kontentHost}`,
};

export const internalApiUrl = (base: BaseUrl, path: string): URL =>
  new URL(path, `${base.protocol}://${base.host}`);

export type InternalApiClient = Readonly<{
  config: SdkConfig;
  sdkInfo: SdkInfo;
  urlBase: BaseUrl;
  token: string;
}>;

export const createInternalApiClient = (token: string): InternalApiClient => ({
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
