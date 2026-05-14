import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ResearchDetail } from "@/components/screens/ResearchDetail.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";
import { isNonDefaultLanguage } from "@/lib/i18n.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; slug: string; lang: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, slug, lang } = await params;
  if (!isNonDefaultLanguage(lang)) {
    notFound();
  }
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return (
    <ResearchDetail
      envId={envId}
      apiKey={apiKey}
      isPreviewEnabled={isEnabled}
      slug={slug}
      lang={lang}
    />
  );
}
