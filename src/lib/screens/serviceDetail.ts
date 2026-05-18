import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import type { Service } from "@/model/index.ts";
import type { LoadResult } from "./types.ts";

export const loadServiceDetail = async (
  client: IDeliveryClient,
  slug: string,
  locale: SupportedLanguage,
): Promise<LoadResult<Service>> => {
  const [strict, exists] = await Promise.all([
    client
      .items<Service>()
      .type("service")
      .equalsFilter("elements.url_slug", slug)
      .languageParameter(locale)
      .equalsFilter("system.language", locale)
      .toPromise(),
    client.items<Service>().type("service").equalsFilter("elements.url_slug", slug).toPromise(),
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
