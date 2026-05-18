import { draftMode } from "next/headers";
import { ResearchDetail } from "@/components/screens/ResearchDetail.tsx";
import { ResearchDetailPreview } from "@/components/screens/ResearchDetailPreview.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; locale: SupportedLanguage; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, locale, slug } = await params;
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return <ResearchDetailPreview envId={envId} slug={slug} locale={locale} />;
  }
  const apiKey = await resolveApiKey(envId);
  return (
    <ResearchDetail
      envId={envId}
      apiKey={apiKey}
      isPreviewEnabled={false}
      slug={slug}
      locale={locale}
    />
  );
}
