"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import { TeamMemberView } from "@/components/screens/TeamMemberView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { LoadResult } from "@/lib/screens/types.ts";
import type { Person } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
  locale: SupportedLanguage;
}>;

export const TeamMemberPreview = ({ envId, slug, locale }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<LoadResult<Person>>("team-member", { envId, codename: slug, locale }),
    [envId, slug, locale],
  );

  const applyUpdate = useCallback(
    async (current: LoadResult<Person>, update: IUpdateMessageData) => {
      if (current.kind !== "found") {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(
        current.item,
        update,
        async (codenames) => [...(await fetchLinkedItems(envId, codenames))],
      );
      return { kind: "found" as const, item: next as Person };
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<LoadResult<Person>>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug, locale],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} languageCodename={locale} />
      {data?.kind === "found" ? (
        <TeamMemberView person={data.item} />
      ) : data?.kind === "notTranslated" ? (
        <NotTranslated locale={locale} />
      ) : isLoading ? null : (
        <div className="flex-grow" />
      )}
    </>
  );
};
