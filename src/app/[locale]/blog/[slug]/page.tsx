import { draftMode } from "next/headers";
import { BlogDetail } from "@/components/screens/BlogDetail.tsx";
import { BlogDetailPreview } from "@/components/screens/BlogDetailPreview.tsx";
import { routing, type SupportedLanguage } from "@/i18n/routing.ts";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";
import type { BlogPost } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

export const dynamicParams = true;
export const revalidate = 300;

export const generateStaticParams = async () => {
  const envId = process.env.KONTENT_ENVIRONMENT_ID;
  const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
  if (!envId || !apiKey) {
    return [];
  }
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled: false });
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => {
      const res = await client
        .items<BlogPost>()
        .type("blog_post")
        .languageParameter(locale)
        .toPromise();
      return res.data.items
        .filter((item) => item.system.language === locale)
        .map((item) => ({ locale, slug: item.elements.url_slug.value }));
    }),
  );
  return perLocale.flat();
};

type Props = Readonly<{
  params: Promise<{ locale: SupportedLanguage; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return isEnabled ? (
    <BlogDetailPreview envId={envId} slug={slug} locale={locale} />
  ) : (
    <BlogDetail
      envId={envId}
      apiKey={apiKey}
      isPreviewEnabled={false}
      slug={slug}
      locale={locale}
    />
  );
}
