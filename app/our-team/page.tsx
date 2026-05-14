import { OurTeam } from "@/components/screens/OurTeam.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export default function Page() {
  const { envId, apiKey } = getDefaultEnv();
  return <OurTeam envId={envId} apiKey={apiKey} isPreviewEnabled={false} />;
}
