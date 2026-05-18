import { notFound } from "next/navigation";
import { BlogDetailView } from "@/components/screens/BlogDetailView.tsx";
import { loadBlogDetail } from "@/lib/screens/blogDetail.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
}>;

export const BlogDetail = async ({ envId, apiKey, isPreviewEnabled, slug }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const post = await loadBlogDetail(client, slug);
  if (!post) {
    notFound();
  }
  return <BlogDetailView post={post} />;
};
