import { BlogIndex } from "@/components/screens/BlogIndex.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export default function Page() {
  const { envId, apiKey } = getDefaultEnv();
  return <BlogIndex envId={envId} apiKey={apiKey} isPreviewEnabled={false} />;
}
