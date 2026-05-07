import type { FC } from "react";
import { createItemSmartLink } from "@/utils/smartlink.ts";
import { EnvLink } from "../EnvLink.tsx";
import { Tags } from "../Tags.tsx";
import { FeaturedComponentBase } from "./FeaturedComponentBase.tsx";

type FeaturedArticleProps = Readonly<{
  article: Readonly<{
    image: Readonly<{
      url: string;
      alt: string;
    }>;
    title: string;
    publishDate: string;
    introduction: string;
    topics: ReadonlyArray<string>;
    itemId?: string;
  }>;
  isFeatured?: boolean;
  urlSlug: string;
}>;

export const FeaturedArticle: FC<FeaturedArticleProps> = ({
  article,
  isFeatured = false,
  urlSlug,
}) => (
  <FeaturedComponentBase
    type="article"
    image={{
      url: article.image.url,
      alt: article.image.alt,
    }}
    isFeatured={isFeatured}
  >
    <div {...createItemSmartLink(article.itemId)}>
      <h2 className="text-center lg:text-left text-heading-2 font-semibold text-burgundy">
        {article.title}
      </h2>
      <p className="text-center lg:text-left text-gray-light mt-6 text-body-md">
        {article.publishDate
          ? `Published on ${new Date(article.publishDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
              day: "numeric",
            })}`
          : null}
      </p>
      <Tags tags={article.topics} className="mt-4" />
      <p className="text-left text-gray-700 mt-4 text-body-lg">{article.introduction}</p>
    </div>
    <EnvLink
      href={urlSlug.startsWith("/") ? urlSlug : `/${urlSlug}`}
      className="inline-block text-link-color text-body-lg underline hover:text-link-hover-color mt-6"
    >
      Read more
    </EnvLink>
  </FeaturedComponentBase>
);
