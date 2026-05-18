import { notFound } from "next/navigation";
import { ResearchDetailView } from "@/components/screens/ResearchDetailView.tsx";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/lib/i18n.ts";
import { loadResearchDetail } from "@/lib/screens/researchDetail.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
  lang?: SupportedLanguage;
}>;

export const ResearchDetail = async ({ envId, apiKey, isPreviewEnabled, slug, lang }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const article = await loadResearchDetail(client, slug, lang ?? DEFAULT_LANGUAGE);
  if (!article) {
    notFound();
  }
  return <ResearchDetailView article={article} />;
};
