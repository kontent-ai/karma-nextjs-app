import { notFound } from "next/navigation";
import { BlogDetailView } from "@/components/screens/BlogDetailView.tsx";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { loadBlogDetail } from "@/lib/screens/blogDetail.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
  locale: SupportedLanguage;
}>;

export const BlogDetail = async ({ envId, apiKey, isPreviewEnabled, slug, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const result = await loadBlogDetail(client, slug, locale);
  if (result.kind === "notFound") {
    notFound();
  }
  if (result.kind === "notTranslated") {
    return <NotTranslated locale={locale} />;
  }
  return <BlogDetailView post={result.item} />;
};
