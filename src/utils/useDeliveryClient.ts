import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext.tsx";
import { createClient } from "./client.ts";

export const useDeliveryClient = () => {
  const { environmentId, apiKey } = useAppContext();
  const [searchParams] = useSearchParams();
  const isPreviewEnabled = searchParams.get("preview") === "true";

  const client = useMemo(
    () => createClient(environmentId, apiKey, isPreviewEnabled),
    [environmentId, apiKey, isPreviewEnabled],
  );

  return { client, environmentId, isPreviewEnabled };
};
