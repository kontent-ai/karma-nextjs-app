import KontentSmartLink, {
  type IRefreshMessageData,
  type IRefreshMessageMetadata,
  type IUpdateMessageData,
  KontentSmartLinkEvent,
} from "@kontent-ai/smart-link";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppContext } from "./AppContext.tsx";

interface SmartLinkContextValue {
  readonly smartLink?: KontentSmartLink | null;
}

const defaultContextValue: SmartLinkContextValue = {
  smartLink: undefined,
};

const SmartLinkContext = createContext<SmartLinkContextValue>(defaultContextValue);

const baseUrl = import.meta.env.VITE_KONTENT_URL ?? "kontent.ai";

export const SmartLinkContextComponent: FC<PropsWithChildren> = ({ children }) => {
  const { environmentId } = useAppContext();
  const [smartLink, setSmartLink] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    setSmartLink(KontentSmartLink.initialize());

    return () => {
      smartLink?.destroy();
      setSmartLink(null);
    }
  }, [smartLink]);

  useEffect(() => {
    smartLink?.setConfiguration({
      defaultDataAttributes: {
        environmentId,
        languageCodename: "default",
      },
      baseUrl,
    });
  }, [smartLink, environmentId]);

  const value = useMemo(() => ({ smartLink }), [smartLink]);

  return <SmartLinkContext.Provider value={value}>{children}</SmartLinkContext.Provider>;
};

export const useSmartLink = (): KontentSmartLink | null => {
  const { smartLink } = useContext(SmartLinkContext);

  if (typeof smartLink === "undefined") {
    throw new Error(
      "You need to place SmartLinkProvider to one of the parent components to use useSmartLink.",
    );
  }

  return smartLink;
};

export const useCustomRefresh = (
  callback: (
    data: IRefreshMessageData,
    metadata: IRefreshMessageMetadata,
    originalRefresh: () => void,
  ) => void,
): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Refresh, callback);

      return () => {
        smartLink.off(KontentSmartLinkEvent.Refresh, callback);
      };
    }

    return;
  }, [smartLink, callback]);
};

export const useSmartLinkRefetch = (refetch: () => unknown): void => {
  const callback = useCallback(
    (
      _data: IRefreshMessageData,
      metadata: IRefreshMessageMetadata,
      originalRefresh: () => void,
    ) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        void refetch();
      }
    },
    [refetch],
  );

  useCustomRefresh(callback);
};

export const useLivePreview = (callback: (data: IUpdateMessageData) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, callback);

      return () => {
        smartLink.off(KontentSmartLinkEvent.Update, callback);
      };
    }

    return;
  }, [smartLink, callback]);
};
