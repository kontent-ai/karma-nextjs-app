import { draftMode } from "next/headers";
import { Landing } from "@/components/screens/Landing.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return <Landing envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} />;
}
