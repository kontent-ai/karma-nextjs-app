"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { ServiceDetailView } from "@/components/screens/ServiceDetailView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { Service } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
}>;

export const ServiceDetailPreview = ({ envId, slug }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<Service | null>("service-detail", { envId, slug }),
    [envId, slug],
  );

  const applyUpdate = useCallback(
    async (current: Service | null, update: IUpdateMessageData) => {
      if (!current) {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(current, update, async (codenames) => [
        ...(await fetchLinkedItems(envId, codenames)),
      ]);
      return next as Service;
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<Service | null>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} />
      {data ? (
        <ServiceDetailView service={data} />
      ) : isLoading ? null : (
        <div className="flex-grow" />
      )}
    </>
  );
};
