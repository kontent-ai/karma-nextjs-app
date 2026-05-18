import { draftMode } from "next/headers";
import { BlogDetail } from "@/components/screens/BlogDetail.tsx";
import { BlogDetailPreview } from "@/components/screens/BlogDetailPreview.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, slug } = await params;
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return <BlogDetailPreview envId={envId} slug={slug} />;
  }
  const apiKey = await resolveApiKey(envId);
  return <BlogDetail envId={envId} apiKey={apiKey} isPreviewEnabled={false} slug={slug} />;
}
