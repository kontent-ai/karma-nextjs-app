import { useAuth0 } from "@auth0/auth0-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createContext, type FC, type PropsWithChildren, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { loadPreviewApiKey } from "../utils/api.ts";

type AppContext = {
  environmentId: string;
  apiKey: string;
};

const { VITE_ENVIRONMENT_ID, VITE_DELIVERY_API_KEY } = import.meta.env;

if (!VITE_ENVIRONMENT_ID || !VITE_DELIVERY_API_KEY) {
  const missing = [
    !VITE_ENVIRONMENT_ID && "VITE_ENVIRONMENT_ID",
    !VITE_DELIVERY_API_KEY && "VITE_DELIVERY_API_KEY",
  ]
    .filter(Boolean)
    .join(", ");
  throw new Error(`Missing required environment variables: ${missing}. See .env.template.`);
}

const defaultAppContext: AppContext = {
  environmentId: VITE_ENVIRONMENT_ID,
  apiKey: VITE_DELIVERY_API_KEY,
};

const AppContext = createContext<AppContext>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppContextComponent: FC<PropsWithChildren> = ({ children }) => {
  const { envId } = useParams();
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const contextData = useSuspenseQuery({
    queryKey: ["env-data", envId ?? null],
    queryFn: async () => {
      if (!envId) {
        return defaultAppContext;
      }
      return await getAccessTokenSilently()
        .then(
          async (res) =>
            await loadPreviewApiKey({
              accessToken: res,
              environmentId: envId,
            }),
        )
        .then((res) => {
          if (!res) {
            throw new Error("Could not obtain preview API KEY");
          }

          return { environmentId: envId, apiKey: res };
        })
        .catch((err: unknown) => {
          if (
            typeof err === "object" &&
            err !== null &&
            "error" in err &&
            (err.error === "login_required" || err.error === "consent_required")
          ) {
            void loginWithRedirect();
          }
          throw err;
        });
    },
  });

  const value = useMemo(
    () => ({
      environmentId: contextData.data.environmentId,
      apiKey: contextData.data.apiKey,
    }),
    [contextData.data.environmentId, contextData.data.apiKey],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
