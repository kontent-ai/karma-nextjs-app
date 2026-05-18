import { createFetchQuery } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type IapiClient, iapiUrl } from "../client.ts";

const ApiKeyDetailSchema = z.object({
  api_key: z.string(),
});

export const getApiKeyDetail = (c: IapiClient, containerId: string, tokenSeedId: string) =>
  createFetchQuery({
    url: iapiUrl(c.urlBase, `/api/project-container/${containerId}/keys/${tokenSeedId}`),
    zodSchema: ApiKeyDetailSchema,
    config: c.config,
    sdkInfo: c.sdkInfo,
    authorizationApiKey: c.token,
    mapError: (e) => e,
    mapMetadata: () => ({}),
    mapExtraResponseProps: () => ({}),
  });
