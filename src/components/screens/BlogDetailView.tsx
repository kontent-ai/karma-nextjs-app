import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { KontentImage } from "@/components/KontentImage.tsx";
import type { BlogPost } from "@/model/index.ts";
import { defaultPortableRichTextResolvers } from "@/utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";

type Props = Readonly<{
  post: BlogPost;
}>;

export const BlogDetailView: FC<Props> = ({ post }) => {
  const t = useTranslations();
  return (
    <div className="container flex flex-col gap-12">
      <div className="flex flex-row items-center pt-[104px] pb-[160px]">
        <div className="flex flex-col flex-1 gap-6 ">
          <div className="w-fit text-small border tracking-wider font-[700] text-grey border-azure px-4 py-2 rounded-lg uppercase">
            {t("blogPost.typeLabel")}
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
            className="rounded-lg w-full h-auto"
            isPriority={true}
            sizes="(min-width: 1024px) 50vw, 100vw"
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
};
