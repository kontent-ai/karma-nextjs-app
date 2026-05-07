import { headers } from "next/headers";
import { cache } from "react";
import { getSession } from "@/lib/auth0/session.ts";

const getEnvIdFromRequest = cache(async () => (await headers()).get("x-kontent-env-id"));

type EnvContextBase = Readonly<{
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
    const session = await getSession();
    const cached = session.currentKey;
    if (cached?.envId === envId && cached.expiresAt > Date.now()) {
      return cached.apiKey;
    }
    throw new Error(
      `No valid cached delivery key for environment ${envId} — proxy should have redirected to /auth/login.`,
    );
  }

  const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KONTENT_DELIVERY_API_KEY environment variable.");
  }
  return apiKey;
});
