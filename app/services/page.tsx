import { Services } from "@/components/screens/Services.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

export default function Page() {
  const { envId, apiKey } = getDefaultEnv();
  return <Services envId={envId} apiKey={apiKey} isPreviewEnabled={false} />;
}
