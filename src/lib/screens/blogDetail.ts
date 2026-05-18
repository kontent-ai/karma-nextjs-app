import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import type { BlogPost } from "@/model/index.ts";
import type { LoadResult } from "./types.ts";

export const loadBlogDetail = async (
  client: IDeliveryClient,
  slug: string,
  locale: SupportedLanguage,
): Promise<LoadResult<BlogPost>> => {
  // Strict fetch (no fallback) + existence probe in parallel. Strict tells us
  // whether the variant exists in the requested locale; the probe tells us
  // whether the item exists at all.
  const [strict, exists] = await Promise.all([
    client
      .items<BlogPost>()
      .type("blog_post")
      .equalsFilter("elements.url_slug", slug)
      .languageParameter(locale)
      .equalsFilter("system.language", locale)
      .toPromise(),
    client.items<BlogPost>().type("blog_post").equalsFilter("elements.url_slug", slug).toPromise(),
  ]);

  const item = strict.data.items[0];
  if (item) {
    return { kind: "found", item };
  }
  if (exists.data.items[0]) {
    return { kind: "notTranslated" };
  }
  return { kind: "notFound" };
};
