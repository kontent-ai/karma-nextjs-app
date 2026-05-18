"use client";

import KontentSmartLink, { KontentSmartLinkEvent } from "@kontent-ai/smart-link";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const baseUrl = process.env.NEXT_PUBLIC_KONTENT_URL ?? "kontent.ai";

type SmartLinkContextValue = Readonly<{
  instance: KontentSmartLink | null;
}>;

const SmartLinkContext = createContext<SmartLinkContextValue>({ instance: null });

export const useSmartLink = (): SmartLinkContextValue => useContext(SmartLinkContext);

export const SmartLinkProvider: FC<PropsWithChildren> = ({ children }) => {
  const [instance, setInstance] = useState<KontentSmartLink | null>(null);

  useEffect(() => {
    const created = KontentSmartLink.initialize({ baseUrl });
    setInstance(created);
    return () => {
      created.destroy();
      setInstance(null);
    };
  }, []);

  // Register a noop Refresh handler. Not calling `original()` cancels the
  // SDK's default Refresh behavior (full reload). Live update via the Update
  // event is the sole rendering path.
  useEffect(() => {
    if (!instance) {
      return;
    }
    const onRefresh = () => {};
    instance.on(KontentSmartLinkEvent.Refresh, onRefresh);
    return () => {
      instance.off(KontentSmartLinkEvent.Refresh, onRefresh);
    };
  }, [instance]);

  const value = useMemo<SmartLinkContextValue>(() => ({ instance }), [instance]);
  return <SmartLinkContext.Provider value={value}>{children}</SmartLinkContext.Provider>;
};

type EnvironmentProps = Readonly<{
  environmentId: string;
}>;

export const SmartLinkEnvironment: FC<EnvironmentProps> = ({ environmentId }) => {
  const { instance } = useSmartLink();
  useEffect(() => {
    instance?.setConfiguration({
      defaultDataAttributes: {
        environmentId,
        languageCodename: "default",
      },
    });
  }, [instance, environmentId]);
  return null;
};
