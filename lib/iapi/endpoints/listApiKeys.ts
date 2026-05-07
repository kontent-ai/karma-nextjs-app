import { createMutationQuery } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type IapiClient, iapiUrl } from "../client.ts";

export const ApiKeyTypeSchema = z.enum([
  "unknown",
  "delivery-api",
  "management-api-pat",
  "management-api",
  "subscription-api",
  "web-spotlight-api",
  "delivery-api-primary",
  "delivery-api-secondary",
  "preview-delivery-api-primary",
  "preview-delivery-api-secondary",
]);

export type ApiKeyType = z.infer<typeof ApiKeyTypeSchema>;

const ApiKeyListingSchema = z.array(
  z.object({
    token_seed_id: z.string(),
  }),
);

export type ListApiKeysFilter = Readonly<{
  query?: string;
  apiKeyTypes?: ReadonlyArray<ApiKeyType>;
  environments?: ReadonlyArray<string>;
}>;

export const listApiKeys = (c: IapiClient, containerId: string, filter: ListApiKeysFilter = {}) =>
  createMutationQuery({
    method: "POST",
    url: iapiUrl(c.urlBase, `/api/project-container/${containerId}/keys/listing`),
    body: {
      query: filter.query ?? null,
      api_key_types: filter.apiKeyTypes ?? null,
      environments: filter.environments ?? null,
    },
    zodSchema: ApiKeyListingSchema,
    config: c.config,
    sdkInfo: c.sdkInfo,
    authorizationApiKey: c.token,
    mapError: (e) => e,
    mapMetadata: () => ({}),
    mapExtraResponseProps: () => ({}),
  });
