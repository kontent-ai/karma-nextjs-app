"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import { ServiceDetailView } from "@/components/screens/ServiceDetailView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { LoadResult } from "@/lib/screens/types.ts";
import type { Service } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
  locale: SupportedLanguage;
}>;

export const ServiceDetailPreview = ({ envId, slug, locale }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<LoadResult<Service>>("service-detail", { envId, slug, locale }),
    [envId, slug, locale],
  );

  const applyUpdate = useCallback(
    async (current: LoadResult<Service>, update: IUpdateMessageData) => {
      if (current.kind !== "found") {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(
        current.item,
        update,
        async (codenames) => [...(await fetchLinkedItems(envId, codenames))],
      );
      return { kind: "found" as const, item: next as Service };
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<LoadResult<Service>>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug, locale],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} languageCodename={locale} />
      {data?.kind === "found" ? (
        <ServiceDetailView service={data.item} />
      ) : data?.kind === "notTranslated" ? (
        <NotTranslated locale={locale} />
      ) : isLoading ? null : (
        <div className="flex-grow" />
      )}
    </>
  );
};
