import { DeliveryError, type IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { Person } from "@/model/index.ts";

export const loadTeamMember = async (
  client: IDeliveryClient,
  codename: string,
): Promise<Person | null> => {
  try {
    const res = await client.item<Person>(codename).toPromise();
    return res.data.item;
  } catch (err) {
    if (err instanceof DeliveryError) {
      return null;
    }
    throw err;
  }
};
