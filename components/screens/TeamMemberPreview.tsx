"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { TeamMemberView } from "@/components/screens/TeamMemberView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { Person } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
}>;

export const TeamMemberPreview = ({ envId, slug }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<Person | null>("team-member", { envId, codename: slug }),
    [envId, slug],
  );

  const applyUpdate = useCallback(
    async (current: Person | null, update: IUpdateMessageData) => {
      if (!current) {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(current, update, async (codenames) => [
        ...(await fetchLinkedItems(envId, codenames)),
      ]);
      return next as Person;
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<Person | null>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} />
      {data ? <TeamMemberView person={data} /> : isLoading ? null : <div className="flex-grow" />}
    </>
  );
};
