"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { LandingView } from "@/components/screens/LandingView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { LandingPageItem } from "@/lib/screens/landing.ts";

type Props = Readonly<{
  envId: string;
}>;

export const LandingPreview = ({ envId }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<LandingPageItem | null>("landing", { envId }),
    [envId],
  );

  const applyUpdate = useCallback(
    async (current: LandingPageItem | null, update: IUpdateMessageData) => {
      if (!current) {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(current, update, async (codenames) => [
        ...(await fetchLinkedItems(envId, codenames)),
      ]);
      return next as LandingPageItem;
    },
    [envId],
  );

  const { data } = useSmartLinkPreview<LandingPageItem | null>({
    initialFetch,
    applyUpdate,
    deps: [envId],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} />
      <LandingView landingPage={data} />
    </>
  );
};
