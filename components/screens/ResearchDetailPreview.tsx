"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { ResearchDetailView } from "@/components/screens/ResearchDetailView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/lib/i18n.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { Article } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
  lang?: SupportedLanguage;
}>;

export const ResearchDetailPreview = ({ envId, slug, lang }: Props) => {
  const language = lang ?? DEFAULT_LANGUAGE;

  const initialFetch = useCallback(
    async () => fetchScreen<Article | null>("research-detail", { envId, slug, lang: language }),
    [envId, slug, language],
  );

  const applyUpdate = useCallback(
    async (current: Article | null, update: IUpdateMessageData) => {
      if (!current) {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(current, update, async (codenames) => [
        ...(await fetchLinkedItems(envId, codenames)),
      ]);
      return next as Article;
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<Article | null>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug, language],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} />
      {data ? (
        <ResearchDetailView article={data} />
      ) : isLoading ? null : (
        <div className="flex-grow" />
      )}
    </>
  );
};
