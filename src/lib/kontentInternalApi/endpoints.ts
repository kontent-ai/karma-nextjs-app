import { createFetchQuery, createMutationQuery } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type InternalApiClient, internalApiUrl } from "./client.ts";

const ProjectResponseSchema = z.object({
  projectContainerId: z.string(),
});

export const getProjectInfo = (c: InternalApiClient, environmentId: string) =>
  createFetchQuery({
    url: internalApiUrl(c.urlBase, `/api/project-management/${environmentId}`),
    zodSchema: ProjectResponseSchema,
    config: c.config,
    sdkInfo: c.sdkInfo,
    authorizationApiKey: c.token,
    mapError: (e) => e,
    mapMetadata: () => ({}),
    mapExtraResponseProps: () => ({}),
  });

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

export const listApiKeys = (
  c: InternalApiClient,
  containerId: string,
  filter: ListApiKeysFilter = {},
) =>
  createMutationQuery({
    method: "POST",
    url: internalApiUrl(c.urlBase, `/api/project-container/${containerId}/keys/listing`),
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

const ApiKeyDetailSchema = z.object({
  api_key: z.string(),
});

export const getApiKeyDetail = (c: InternalApiClient, containerId: string, tokenSeedId: string) =>
  createFetchQuery({
    url: internalApiUrl(c.urlBase, `/api/project-container/${containerId}/keys/${tokenSeedId}`),
    zodSchema: ApiKeyDetailSchema,
    config: c.config,
    sdkInfo: c.sdkInfo,
    authorizationApiKey: c.token,
    mapError: (e) => e,
    mapMetadata: () => ({}),
    mapExtraResponseProps: () => ({}),
  });
