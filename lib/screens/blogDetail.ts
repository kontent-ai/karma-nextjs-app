import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import type { BlogPost } from "@/model/index.ts";

export const loadBlogDetail = async (
  client: IDeliveryClient,
  slug: string,
): Promise<BlogPost | null> => {
  const res = await client
    .items<BlogPost>()
    .type("blog_post")
    .equalsFilter("elements.url_slug", slug)
    .toPromise();
  return res.data.items[0] ?? null;
};
