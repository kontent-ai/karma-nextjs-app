import { Research } from "@/components/screens/Research.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

export default function Page() {
  const { envId, apiKey } = getDefaultEnv();
  return <Research envId={envId} apiKey={apiKey} isPreviewEnabled={false} />;
}
