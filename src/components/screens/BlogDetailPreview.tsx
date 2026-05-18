"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { BlogDetailView } from "@/components/screens/BlogDetailView.tsx";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { LoadResult } from "@/lib/screens/types.ts";
import type { BlogPost } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
  locale: SupportedLanguage;
}>;

export const BlogDetailPreview = ({ envId, slug, locale }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<LoadResult<BlogPost>>("blog-detail", { envId, slug, locale }),
    [envId, slug, locale],
  );

  const applyUpdate = useCallback(
    async (current: LoadResult<BlogPost>, update: IUpdateMessageData) => {
      if (current.kind !== "found") {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(
        current.item,
        update,
        async (codenames) => [...(await fetchLinkedItems(envId, codenames))],
      );
      return { kind: "found" as const, item: next as BlogPost };
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<LoadResult<BlogPost>>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug, locale],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} languageCodename={locale} />
      {data?.kind === "found" ? (
        <BlogDetailView post={data.item} />
      ) : data?.kind === "notTranslated" ? (
        <NotTranslated locale={locale} />
      ) : isLoading ? null : (
        <div className="flex-grow" />
      )}
    </>
  );
};
