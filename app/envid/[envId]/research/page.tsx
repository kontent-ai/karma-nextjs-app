import { draftMode } from "next/headers";
import { Research } from "@/components/screens/Research.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return <Research envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} />;
}
