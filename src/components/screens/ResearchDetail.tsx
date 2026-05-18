import { notFound } from "next/navigation";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import { ResearchDetailView } from "@/components/screens/ResearchDetailView.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { loadResearchDetail } from "@/lib/screens/researchDetail.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
  locale: SupportedLanguage;
}>;

export const ResearchDetail = async ({ envId, apiKey, isPreviewEnabled, slug, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const result = await loadResearchDetail(client, slug, locale);
  if (result.kind === "notFound") {
    notFound();
  }
  if (result.kind === "notTranslated") {
    return <NotTranslated locale={locale} />;
  }
  return <ResearchDetailView article={result.item} locale={locale} />;
};
