import { notFound } from "next/navigation";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import { ServiceDetailView } from "@/components/screens/ServiceDetailView.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { loadServiceDetail } from "@/lib/screens/serviceDetail.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
  locale: SupportedLanguage;
}>;

export const ServiceDetail = async ({ envId, apiKey, isPreviewEnabled, slug, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const result = await loadServiceDetail(client, slug, locale);
  if (result.kind === "notFound") {
    notFound();
  }
  if (result.kind === "notTranslated") {
    return <NotTranslated locale={locale} />;
  }
  return <ServiceDetailView service={result.item} />;
};
