import { draftMode } from "next/headers";
import { ServiceDetail } from "@/components/screens/ServiceDetail.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, slug } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return <ServiceDetail envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} slug={slug} />;
}
