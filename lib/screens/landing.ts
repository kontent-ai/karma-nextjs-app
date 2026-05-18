import { DeliveryError, type IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { LandingPage } from "@/model/index.ts";
import type { Replace } from "@/utils/types.ts";

export type LandingPageItem = Replace<LandingPage, { elements: Partial<LandingPage["elements"]> }>;

export const loadLanding = async (client: IDeliveryClient): Promise<LandingPageItem | null> => {
  try {
    const res = await client.items().type("landing_page").limitParameter(1).toPromise();
    return (res.data.items[0] as LandingPageItem | undefined) ?? null;
  } catch (err) {
    if (err instanceof DeliveryError) {
      return null;
    }
    throw err;
  }
};
