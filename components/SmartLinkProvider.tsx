"use client";

import KontentSmartLink, { KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import { useRouter } from "next/navigation";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_KONTENT_URL || "kontent.ai";

type Props = PropsWithChildren<
  Readonly<{
    environmentId: string;
  }>
>;

export const SmartLinkProvider: FC<Props> = ({ environmentId, children }) => {
  const router = useRouter();
  const [smartLink, setSmartLink] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const instance = KontentSmartLink.initialize();
    setSmartLink(instance);
    return () => {
      instance.destroy();
      setSmartLink(null);
    };
  }, []);

  useEffect(() => {
    smartLink?.setConfiguration({
      defaultDataAttributes: {
        environmentId,
        languageCodename: "default",
      },
      baseUrl,
    });
  }, [smartLink, environmentId]);

  useEffect(() => {
    if (!smartLink) {
      return;
    }
    const onRefresh = (
      _data: unknown,
      metadata: { manualRefresh?: boolean },
      original: () => void,
    ) => {
      if (metadata.manualRefresh) {
        original();
      } else {
        router.refresh();
      }
    };
    smartLink.on(KontentSmartLinkEvent.Refresh, onRefresh);
    return () => {
      smartLink.off(KontentSmartLinkEvent.Refresh, onRefresh);
    };
  }, [smartLink, router]);

  return <>{children}</>;
};
