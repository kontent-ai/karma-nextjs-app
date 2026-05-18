"use client";

import { type IUpdateMessageData, KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import { useEffect, useRef, useState } from "react";
import { useSmartLink } from "@/components/SmartLinkProvider.tsx";

type Options<T> = Readonly<{
  initialFetch: () => Promise<T>;
  applyUpdate: (state: T, update: IUpdateMessageData) => Promise<T>;
  deps?: ReadonlyArray<unknown>;
}>;

type Result<T> = Readonly<{
  data: T | null;
  isLoading: boolean;
}>;

export const useSmartLinkPreview = <T>({
  initialFetch,
  applyUpdate,
  deps = [],
}: Options<T>): Result<T> => {
  const { instance } = useSmartLink();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dataRef = useRef<T | null>(null);
  dataRef.current = data;

  const applyUpdateRef = useRef(applyUpdate);
  applyUpdateRef.current = applyUpdate;

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const run = async () => {
      try {
        const next = await initialFetch();
        if (!isCancelled) {
          setData(next);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };
    void run();
    return () => {
      isCancelled = true;
    };
  }, [initialFetch, ...deps]);

  useEffect(() => {
    if (!instance) {
      return;
    }
    const onUpdate = async (update: IUpdateMessageData) => {
      const current = dataRef.current;
      if (current === null) {
        return;
      }
      const next = await applyUpdateRef.current(current, update);
      setData(next);
    };
    instance.on(KontentSmartLinkEvent.Update, onUpdate);
    return () => {
      instance.off(KontentSmartLinkEvent.Update, onUpdate);
    };
  }, [instance]);

  return { data, isLoading };
};
