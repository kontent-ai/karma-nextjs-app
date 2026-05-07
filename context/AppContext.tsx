"use client";

import { createContext, type FC, type PropsWithChildren, useContext } from "react";

export type AppContextValue = Readonly<{
  environmentId: string;
  urlPrefix: string;
}>;

const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppContextProvider.");
  }
  return ctx;
};

type Props = PropsWithChildren<Readonly<{ value: AppContextValue }>>;

export const AppContextProvider: FC<Props> = ({ value, children }) => (
  <AppContext.Provider value={value}>{children}</AppContext.Provider>
);
