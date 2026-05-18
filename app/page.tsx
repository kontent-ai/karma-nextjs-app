import { draftMode } from "next/headers";
import { Landing } from "@/components/screens/Landing.tsx";
import { LandingPreview } from "@/components/screens/LandingPreview.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

export default async function Page() {
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return isEnabled ? (
    <LandingPreview envId={envId} />
  ) : (
    <Landing envId={envId} apiKey={apiKey} isPreviewEnabled={false} />
  );
}
