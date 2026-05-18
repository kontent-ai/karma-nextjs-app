import { draftMode } from "next/headers";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { Services } from "@/components/screens/Services.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

export default async function Page() {
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return (
    <>
      {isEnabled ? <SmartLinkEnvironment environmentId={envId} /> : null}
      <Services envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} />
    </>
  );
}
