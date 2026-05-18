"use client";

import {
  applyUpdateOnItemAndLoadLinkedItems,
  type IUpdateMessageData,
} from "@kontent-ai/smart-link";
import { useCallback } from "react";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { BlogDetailView } from "@/components/screens/BlogDetailView.tsx";
import { useSmartLinkPreview } from "@/hooks/useSmartLinkPreview.ts";
import { fetchLinkedItems, fetchScreen } from "@/lib/preview/client.ts";
import type { BlogPost } from "@/model/index.ts";

type Props = Readonly<{
  envId: string;
  slug: string;
}>;

export const BlogDetailPreview = ({ envId, slug }: Props) => {
  const initialFetch = useCallback(
    async () => fetchScreen<BlogPost | null>("blog-detail", { envId, slug }),
    [envId, slug],
  );

  const applyUpdate = useCallback(
    async (current: BlogPost | null, update: IUpdateMessageData) => {
      if (!current) {
        return current;
      }
      const next = await applyUpdateOnItemAndLoadLinkedItems(current, update, async (codenames) => [
        ...(await fetchLinkedItems(envId, codenames)),
      ]);
      return next as BlogPost;
    },
    [envId],
  );

  const { data, isLoading } = useSmartLinkPreview<BlogPost | null>({
    initialFetch,
    applyUpdate,
    deps: [envId, slug],
  });

  return (
    <>
      <SmartLinkEnvironment environmentId={envId} />
      {data ? <BlogDetailView post={data} /> : isLoading ? null : <div className="flex-grow" />}
    </>
  );
};
