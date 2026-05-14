import { Landing } from "@/components/screens/Landing.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export default function Page() {
  const { envId, apiKey } = getDefaultEnv();
  return <Landing envId={envId} apiKey={apiKey} isPreviewEnabled={false} />;
}
