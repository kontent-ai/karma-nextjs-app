import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { notFound } from "next/navigation";
import { KontentImage } from "@/components/KontentImage.tsx";
import type { BlogPost } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers } from "@/utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";
import { getApiKey, getEnvContextBase } from "../../_lib/getEnvContext.ts";

type Props = Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}>;

export default async function BlogDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const isPreviewEnabled = (await searchParams).preview === "true";
  const { environmentId } = await getEnvContextBase();
  const apiKey = await getApiKey();
  const client = getDeliveryClient({ environmentId, apiKey, isPreviewEnabled });

  const res = await client
    .items<BlogPost>()
    .type("blog_post")
    .equalsFilter("elements.url_slug", slug)
    .toPromise();
  const post = res.data.items[0];
  if (!post) {
    notFound();
  }

  return (
    <div className="container flex flex-col gap-12">
      <div className="flex flex-row items-center pt-[104px] pb-[160px]">
        <div className="flex flex-col flex-1 gap-6 ">
          <div className="w-fit text-small border tracking-wider font-[700] text-grey border-azure px-4 py-2 rounded-lg uppercase">
            Blog Post
          </div>
          <h1
            className="text-heading-1 text-heading-1-color mb-6 max-w-[12ch]"
            {...createItemSmartLink(post.system.id)}
            {...createElementSmartLink("title")}
          >
            {post.elements.title?.value}
          </h1>
        </div>
        <div className="flex flex-col flex-1">
          <KontentImage
            src={post.elements.image?.value[0]?.url}
            alt={post.elements.image?.value[0]?.description ?? ""}
            width={670}
            height={440}
            className="rounded-lg"
            isPriority={true}
          />
        </div>
      </div>
      <div
        className="rich-text-body max-w-3xl mx-auto flex flex-col gap-5"
        {...createItemSmartLink(post.system.id)}
        {...createElementSmartLink("body")}
      >
        <PortableText
          value={transformToPortableText(post.elements.body?.value)}
          components={defaultPortableRichTextResolvers}
        />
      </div>
    </div>
  );
}
