import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import type { Person } from "@/model/index.ts";
import type { LoadResult } from "./types.ts";

export const loadTeamMember = async (
  client: IDeliveryClient,
  codename: string,
  locale: SupportedLanguage,
): Promise<LoadResult<Person>> => {
  const [strict, exists] = await Promise.all([
    client
      .items<Person>()
      .type("person")
      .equalsFilter("system.codename", codename)
      .languageParameter(locale)
      .equalsFilter("system.language", locale)
      .toPromise(),
    client.items<Person>().type("person").equalsFilter("system.codename", codename).toPromise(),
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
