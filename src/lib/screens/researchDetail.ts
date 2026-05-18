import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import type { Article } from "@/model/index.ts";
import type { LoadResult } from "./types.ts";

export const loadResearchDetail = async (
  client: IDeliveryClient,
  slug: string,
  locale: SupportedLanguage,
): Promise<LoadResult<Article>> => {
  // Step 1: existence probe by slug, language-agnostic.
  const systemRes = await client
    .items<Article>()
    .type("article")
    .equalsFilter("elements.url_slug", slug)
    .toPromise();
  const codename = systemRes.data.items[0]?.system.codename;
  if (!codename) {
    return { kind: "notFound" };
  }

  // Step 2: strict fetch in the requested locale (no fallback) — needs the
  // codename to attach depthParameter for linked authors / related articles.
  const articleRes = await client
    .items<Article>()
    .type("article")
    .equalsFilter("system.codename", codename)
    .languageParameter(locale)
    .equalsFilter("system.language", locale)
    .depthParameter(1)
    .toPromise();
  const item = articleRes.data.items[0];
  if (!item) {
    return { kind: "notTranslated" };
  }
  return { kind: "found", item };
};
