import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/lib/i18n.ts";
import type { Article } from "@/model/index.ts";

export const loadResearchDetail = async (
  client: IDeliveryClient,
  slug: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE,
): Promise<Article | null> => {
  const systemRes = await client
    .items<Article>()
    .type("article")
    .equalsFilter("elements.url_slug", slug)
    .toPromise();
  const codename = systemRes.data.items[0]?.system.codename;
  if (!codename) {
    return null;
  }

  const articleRes = await client
    .items<Article>()
    .type("article")
    .equalsFilter("system.codename", codename)
    .languageParameter(lang)
    .depthParameter(1)
    .toPromise();
  return articleRes.data.items[0] ?? null;
};
