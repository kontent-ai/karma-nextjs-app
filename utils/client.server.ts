import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { CoreClientTypes } from "@/model/index.ts";

const url = process.env.NEXT_PUBLIC_KONTENT_URL || "kontent.ai";

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
      baseUrl: `https://deliver.${url}`,
      basePreviewUrl: `https://preview-deliver.${url}`,
    },
  });
