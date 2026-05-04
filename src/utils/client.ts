import { createDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { CoreClientTypes } from "../model/index.ts";

const url = !import.meta.env.VITE_KONTENT_URL ? "kontent.ai" : import.meta.env.VITE_KONTENT_URL;

export const createClient = (
  environmentId: string,
  previewApiKey: string,
  isPreviewEnabled: boolean,
) =>
  createDeliveryClient<CoreClientTypes>({
    environmentId,
    previewApiKey,
    defaultQueryConfig: {
      usePreviewMode: isPreviewEnabled,
      waitForLoadingNewContent: true,
    },
    proxy: {
      baseUrl: `https://deliver.${url}`,
      basePreviewUrl: `https://preview-deliver.${url}`,
    },
  });
