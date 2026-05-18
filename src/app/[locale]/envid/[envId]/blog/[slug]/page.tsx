import { draftMode } from "next/headers";
import { BlogDetail } from "@/components/screens/BlogDetail.tsx";
import { BlogDetailPreview } from "@/components/screens/BlogDetailPreview.tsx";
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
    return <BlogDetailPreview envId={envId} slug={slug} locale={locale} />;
  }
  const apiKey = await resolveApiKey(envId);
  return (
    <BlogDetail
      envId={envId}
      apiKey={apiKey}
      isPreviewEnabled={false}
      slug={slug}
      locale={locale}
    />
  );
}
