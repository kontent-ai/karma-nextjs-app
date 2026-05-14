"use client";

import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { ArticleList } from "@/components/articles/ArticleList.tsx";
import { FiltersClient } from "@/components/filters/FiltersClient.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import type { SelectorOption } from "@/components/Selector.tsx";
import { isArticleType, isGeneralHealthcareTopics } from "@/model/index.ts";

type ArticleData = Readonly<{
  image: Readonly<{ url: string; alt: string }>;
  title: string;
  introduction: string;
  publishDate: string;
  topics: ReadonlyArray<string>;
  urlSlug: string;
  articleTypeCodenames: ReadonlyArray<string>;
  topicCodenames: ReadonlyArray<string>;
}>;

type Props = Readonly<{
  articleTypes: ReadonlyArray<SelectorOption>;
  articleTopics: ReadonlyArray<SelectorOption>;
  articles: ReadonlyArray<ArticleData>;
}>;

export const ArticleListWithFilters: FC<Props> = ({ articleTypes, articleTopics, articles }) => {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type");
  const topicFilter = searchParams.get("topic");

  const filtered = articles
    .filter((a) => (isArticleType(typeFilter) ? a.articleTypeCodenames.includes(typeFilter) : true))
    .filter((a) =>
      isGeneralHealthcareTopics(topicFilter) ? a.topicCodenames.includes(topicFilter) : true,
    );

  return (
    <>
      <PageSection color="bg-white">
        <FiltersClient articleTypes={articleTypes} articleTopics={articleTopics} />
      </PageSection>
      <ArticleList articles={filtered} />
    </>
  );
};
