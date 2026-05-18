import { draftMode } from "next/headers";
import { ServiceDetail } from "@/components/screens/ServiceDetail.tsx";
import { ServiceDetailPreview } from "@/components/screens/ServiceDetailPreview.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, slug } = await params;
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return <ServiceDetailPreview envId={envId} slug={slug} />;
  }
  const apiKey = await resolveApiKey(envId);
  return <ServiceDetail envId={envId} apiKey={apiKey} isPreviewEnabled={false} slug={slug} />;
}
