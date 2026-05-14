import { notFound } from "next/navigation";
import { ResearchDetail } from "@/components/screens/ResearchDetail.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";
import { isNonDefaultLanguage, NON_DEFAULT_LANGUAGES } from "@/lib/i18n.ts";
import type { Article } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const envId = process.env.KONTENT_ENVIRONMENT_ID;
  const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
  if (!envId || !apiKey) {
    return [];
  }
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled: false });

  const results = await Promise.all(
    NON_DEFAULT_LANGUAGES.map(async (lang) => {
      const res = await client.items<Article>().type("article").languageParameter(lang).toPromise();
      return res.data.items
        .filter((item) => item.system.language === lang)
        .map((item) => ({ slug: item.elements.url_slug.value, lang }));
    }),
  );
  return results.flat();
};

type Props = Readonly<{
  params: Promise<{ slug: string; lang: string }>;
}>;

export default async function Page({ params }: Props) {
  const { slug, lang } = await params;
  if (!isNonDefaultLanguage(lang)) {
    notFound();
  }
  const { envId, apiKey } = getDefaultEnv();
  return (
    <ResearchDetail
      envId={envId}
      apiKey={apiKey}
      isPreviewEnabled={false}
      slug={slug}
      lang={lang}
    />
  );
}
