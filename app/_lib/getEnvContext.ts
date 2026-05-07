import { headers } from "next/headers";
import { cache } from "react";
import { getAccessToken } from "@/lib/auth0/tokens.ts";
import { loadPreviewApiKey } from "@/utils/api.ts";

const KONTENT_AUDIENCE = "https://app.kenticocloud.com/";

const getEnvIdFromRequest = cache(async () => (await headers()).get("x-kontent-env-id"));

export type EnvContextBase = Readonly<{
  environmentId: string;
  urlPrefix: string;
}>;

export const getEnvContextBase = cache(async (): Promise<EnvContextBase> => {
  const envId = await getEnvIdFromRequest();
  if (envId) {
    return {
      environmentId: envId,
      urlPrefix: `/envid/${envId}`,
    };
  }

  const defaultEnvId = process.env.KONTENT_ENVIRONMENT_ID;
  if (!defaultEnvId) {
    throw new Error("Missing KONTENT_ENVIRONMENT_ID environment variable.");
  }
  return {
    environmentId: defaultEnvId,
    urlPrefix: "",
  };
});

export const getApiKey = cache(async (): Promise<string> => {
  const envId = await getEnvIdFromRequest();
  if (envId) {
    const accessToken = await getAccessToken({ audience: KONTENT_AUDIENCE });
    const key = await loadPreviewApiKey({ accessToken, environmentId: envId });
    if (!key) {
      throw new Error(`Could not obtain preview API key for environment ${envId}.`);
    }
    return key;
  }

  const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KONTENT_DELIVERY_API_KEY environment variable.");
  }
  return apiKey;
});
