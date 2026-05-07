import { createIapiClient } from "./client.ts";
import { getApiKeyDetail } from "./endpoints/getApiKeyDetail.ts";
import { getProjectInfo } from "./endpoints/getProjectInfo.ts";
import { listApiKeys } from "./endpoints/listApiKeys.ts";

type LoadPreviewApiKeyDeps = Readonly<{
  accessToken: string;
  environmentId: string;
}>;

export const loadPreviewApiKey = async ({
  accessToken,
  environmentId,
}: LoadPreviewApiKeyDeps): Promise<string | null> => {
  const client = createIapiClient(accessToken);

  const project = await getProjectInfo(client, environmentId).fetchSafe();
  if (!project.success) {
    console.error("Failed to fetch project info:", project.error.message);
    return null;
  }
  const containerId = project.response.payload.projectContainerId;

  const keys = await listApiKeys(client, containerId, {
    apiKeyTypes: ["delivery-api"],
    environments: [environmentId],
  }).executeSafe();
  if (!keys.success) {
    console.error("Failed to list API keys:", keys.error.message);
    return null;
  }
  const tokenSeed = keys.response.payload[0]?.token_seed_id;
  if (!tokenSeed) {
    console.error(`No delivery API key for environment ${environmentId}`);
    return null;
  }

  const detail = await getApiKeyDetail(client, containerId, tokenSeed).fetchSafe();
  if (!detail.success) {
    console.error("Failed to fetch API key detail:", detail.error.message);
    return null;
  }
  return detail.response.payload.api_key;
};
