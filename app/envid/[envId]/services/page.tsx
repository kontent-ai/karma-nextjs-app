import { draftMode } from "next/headers";
import { Services } from "@/components/screens/Services.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return <Services envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} />;
}
