import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ResearchDetail } from "@/components/screens/ResearchDetail.tsx";
import { ResearchDetailPreview } from "@/components/screens/ResearchDetailPreview.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";
import { NON_DEFAULT_LANGUAGES, parseLangSegment } from "@/lib/i18n.ts";
import type { Article } from "@/model/index.ts";
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

  const defaultRes = await client.items<Article>().type("article").toPromise();
  const defaultParams = defaultRes.data.items.map((item) => ({
    slug: item.elements.url_slug.value,
    lang: [] as string[],
  }));

  const nonDefaultParams = await Promise.all(
    NON_DEFAULT_LANGUAGES.map(async (lang) => {
      const res = await client.items<Article>().type("article").languageParameter(lang).toPromise();
      return res.data.items
        .filter((item) => item.system.language === lang)
        .map((item) => ({ slug: item.elements.url_slug.value, lang: [lang] }));
    }),
  );

  return [...defaultParams, ...nonDefaultParams.flat()];
};

type Props = Readonly<{
  params: Promise<{ slug: string; lang?: string[] }>;
}>;

export default async function Page({ params }: Props) {
  const { slug, lang } = await params;
  const parsedLang = parseLangSegment(lang);
  if (parsedLang === null) {
    notFound();
  }
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return isEnabled ? (
    <ResearchDetailPreview envId={envId} slug={slug} lang={parsedLang} />
  ) : (
    <ResearchDetail
      envId={envId}
      apiKey={apiKey}
      isPreviewEnabled={false}
      slug={slug}
      lang={parsedLang}
    />
  );
}
