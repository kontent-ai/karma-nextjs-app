import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { CoreClientTypes } from "@/model/index.ts";
import { kontentHost } from "@/utils/kontentHost.ts";

type Args = Readonly<{
  environmentId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
}>;

export const getDeliveryClient = ({ environmentId, apiKey, isPreviewEnabled }: Args) =>
  createDeliveryClient<CoreClientTypes>({
    environmentId,
    previewApiKey: apiKey,
    defaultQueryConfig: {
      usePreviewMode: isPreviewEnabled,
      waitForLoadingNewContent: true,
    },
    proxy: {
      baseUrl: `https://deliver.${kontentHost}`,
      basePreviewUrl: `https://preview-deliver.${kontentHost}`,
    },
  });
