import { createFetchQuery } from "@kontent-ai/core-sdk";
import { z } from "zod";
import { type IapiClient, iapiUrl } from "../client.ts";

const ProjectResponseSchema = z.object({
  projectContainerId: z.string(),
});

export const getProjectInfo = (c: IapiClient, environmentId: string) =>
  createFetchQuery({
    url: iapiUrl(c.urlBase, `/api/project-management/${environmentId}`),
    zodSchema: ProjectResponseSchema,
    config: c.config,
    sdkInfo: c.sdkInfo,
    authorizationApiKey: c.token,
    mapError: (e) => e,
    mapMetadata: () => ({}),
    mapExtraResponseProps: () => ({}),
  });
