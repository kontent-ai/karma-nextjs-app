import { draftMode } from "next/headers";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { OurTeam } from "@/components/screens/OurTeam.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

export default async function Page() {
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return (
    <>
      {isEnabled ? <SmartLinkEnvironment environmentId={envId} /> : null}
      <OurTeam envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} />
    </>
  );
}
