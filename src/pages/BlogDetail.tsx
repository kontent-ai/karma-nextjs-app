import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import type { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type FC, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCustomRefresh } from "../context/SmartLinkContext.tsx";
import type { BlogPost } from "../model/index.ts";
import { NotFoundError } from "../utils/errors.ts";
import { defaultPortableRichTextResolvers } from "../utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "../utils/smartlink.ts";
import { useDeliveryClient } from "../utils/useDeliveryClient.ts";

const BlogDetail: FC = () => {
  const { client, environmentId, isPreviewEnabled } = useDeliveryClient();
  const { slug } = useParams();

  const createTag = (tag: string) => (
    <div className="w-fit text-small border tracking-wider font-[700] text-grey border-azure px-4 py-2 rounded-lg uppercase">
      {tag}
    </div>
  );

  const blogPost = useSuspenseQuery({
    queryKey: ["blog-post", slug, environmentId, isPreviewEnabled],
    queryFn: async () => {
      const res = await client
        .items<BlogPost>()
        .type("blog_post")
        .equalsFilter("elements.url_slug", slug ?? "")
        .toPromise();
      const post = res.data.items[0];
      if (!post) {
        throw new NotFoundError(`Blog post '${slug}' not found`);
      }
      return post;
    },
  });

  const onRefresh = useCallback(
    (_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        blogPost.refetch();
      }
    },
    [blogPost],
  );

  useCustomRefresh(onRefresh);

  return (
    <div className="container flex flex-col gap-12">
      <div className="flex flex-row items-center pt-[104px] pb-[160px]">
        <div className="flex flex-col flex-1 gap-6 ">
          {createTag("Blog Post")}
          <h1
            className="text-heading-1 text-heading-1-color mb-6 max-w-[12ch]"
            {...createItemSmartLink(blogPost.data.system.id)}
            {...createElementSmartLink("title")}
          >
            {blogPost.data.elements.title?.value}
          </h1>
        </div>
        <div className="flex flex-col flex-1">
          <img
            width={670}
            height={440}
            src={blogPost.data.elements.image?.value[0]?.url}
            alt={blogPost.data.elements.image?.value[0]?.description ?? ""}
            className="rounded-lg"
          />
        </div>
      </div>
      <div
        className="rich-text-body max-w-3xl mx-auto flex flex-col gap-5"
        {...createItemSmartLink(blogPost.data.system.id)}
        {...createElementSmartLink("body")}
      >
        <PortableText
          value={transformToPortableText(blogPost.data.elements.body?.value)}
          components={defaultPortableRichTextResolvers}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
