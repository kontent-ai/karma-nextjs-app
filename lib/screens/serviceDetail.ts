import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { Service } from "@/model/index.ts";

export const loadServiceDetail = async (
  client: IDeliveryClient,
  slug: string,
): Promise<Service | null> => {
  const res = await client
    .items<Service>()
    .type("service")
    .equalsFilter("elements.url_slug", slug)
    .toPromise();
  return res.data.items[0] ?? null;
};
