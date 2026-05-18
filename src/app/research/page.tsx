import { draftMode } from "next/headers";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { Research } from "@/components/screens/Research.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

export default async function Page() {
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return (
    <>
      {isEnabled ? <SmartLinkEnvironment environmentId={envId} /> : null}
      <Research envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} />
    </>
  );
}
