import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import type { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type FC, useCallback, useMemo } from "react";
import { NavLink, useSearchParams } from "react-router";
import { useParams } from "react-router-dom";
import ArticleList from "../components/articles/ArticleList.tsx";
import PageSection from "../components/PageSection.tsx";
import PersonCard from "../components/PersonCard.tsx";
import Tags from "../components/Tags.tsx";
import { useAppContext } from "../context/AppContext.tsx";
import { useCustomRefresh } from "../context/SmartLinkContext.tsx";
import type { Article, LanguageCodenames } from "../model/index.ts";
import { createClient } from "../utils/client.ts";
import { NotFoundError } from "../utils/errors.ts";
import { createPreviewLink } from "../utils/link.ts";
import { defaultPortableRichTextResolvers } from "../utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "../utils/smartlink.ts";

const HeroImageAuthorCard: FC<{
  prefix?: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  publishDate?: string;
  image: {
    url: string;
    alt: string;
  };
  codename: string;
  language: LanguageCodenames;
}> = ({ prefix, firstName, lastName, suffix, publishDate, image, codename, language }) => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  return (
    <div className="flex items-center gap-4">
      <img
        src={image.url}
        alt={image.alt}
        className="w-[50px] h-[50px] object-cover rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-white text-body-md">
            {language === "es-ES" ? "Por" : "By"}&nbsp;
          </span>
          <NavLink
            to={createPreviewLink(`/our-team/${codename}`, isPreview)}
            className="text-white text-body-md font-bold hover:text-burgundy underline"
          >
            {prefix ? <span>{prefix}</span> : null}
            {firstName} {lastName}
            {suffix ? <span>, {suffix}</span> : null}
          </NavLink>
        </div>
        {publishDate ? (
          <p className="text-body-md text-white">
            {language === "es-ES" ? "Publicado en" : "Published on"} {publishDate}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const ArticleDetailPage: FC = () => {
  const { environmentId, apiKey } = useAppContext();
  const { slug } = useParams();

  const [searchParams] = useSearchParams();

  const lang = searchParams.get("lang");
  const isPreview = searchParams.get("preview") === "true";

  const articleData = useSuspenseQuery({
    queryKey: ["article-detail", slug, lang],
    queryFn: async () => {
      const client = createClient(environmentId, apiKey, isPreview);
      const systemRes = await client
        .items<Article>()
        .type("article")
        .equalsFilter("elements.url_slug", slug ?? "")
        .toPromise();
      const codename = systemRes.data.items[0]?.system.codename;
      if (!codename) {
        throw new NotFoundError(`Article '${slug}' not found`);
      }
      const articleRes = await client
        .items<Article>()
        .type("article")
        .equalsFilter("system.codename", codename)
        .languageParameter((lang ?? "default") as LanguageCodenames)
        .depthParameter(1)
        .toPromise();
      const article = articleRes.data.items[0];
      if (!article) {
        throw new NotFoundError(`Article '${slug}' not available in ${lang ?? "default"}`);
      }
      return article;
    },
  });

  const onRefresh = useCallback(
    (_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        articleData.refetch();
      }
    },
    [articleData],
  );

  useCustomRefresh(onRefresh);

  const article = articleData.data;

  const formattedDate = useMemo(() => {
    if (!article.elements.publish_date.value) {
      return "";
    }
    return new Date(article.elements.publish_date.value).toLocaleDateString(
      article.system.language === "es-ES" ? "es-ES" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  }, [article.elements.publish_date.value, article.system.language]);

  const author = article.elements.author?.linkedItems[0];

  const authorImage = useMemo(
    () =>
      author
        ? {
            url: author.elements.image?.value[0]?.url ?? "",
            alt:
              author.elements.image?.value[0]?.description ??
              `Photo of ${author.elements.first_name?.value} ${author.elements.last_name?.value}`,
          }
        : null,
    [author],
  );

  const topicNames = useMemo(
    () => article.elements.topics.value.map((topic) => topic.name),
    [article.elements.topics.value],
  );

  const relatedArticleItems = useMemo(
    () =>
      article.elements.related_articles.linkedItems.map((relatedArticle) => ({
        title: relatedArticle.elements.title.value,
        image: {
          url: relatedArticle.elements.image.value[0]?.url ?? "",
          alt: relatedArticle.elements.image.value[0]?.description ?? "",
        },
        urlSlug: relatedArticle.elements.url_slug.value,
        introduction: relatedArticle.elements.introduction.value,
        publishDate: relatedArticle.elements.publish_date.value ?? "",
        topics: relatedArticle.elements.topics.value.map((topic) => topic.name),
      })),
    [article.elements.related_articles.linkedItems],
  );

  return (
    <div className="flex flex-col gap-12">
      <PageSection color="bg-azure">
        <div className="azure-theme flex flex-col-reverse gap-16 lg:flex-row items-center pt-[104px] pb-[160px]">
          <div className="flex flex-col flex-1 gap-6">
            <div className="w-fit text-xs text-body-color border tracking-wider font-[700] border-tag-border-color px-4 py-2 rounded-lg uppercase">
              {article.system.language === "es-ES" ? "Artículo" : "Article"}
            </div>
            <h1
              className="text-heading-1 leading-[84%] text-heading-1-color"
              {...createItemSmartLink(article.system.id)}
              {...createElementSmartLink("title")}
            >
              {article.elements.title.value}
            </h1>
            {author && authorImage ? (
              <HeroImageAuthorCard
                prefix={author.elements.prefix?.value}
                firstName={author.elements.first_name?.value || ""}
                lastName={author.elements.last_name?.value || ""}
                suffix={author.elements.suffixes?.value}
                publishDate={formattedDate}
                image={authorImage}
                codename={author.system.codename}
                language={article.system.language}
              />
            ) : null}
            {topicNames.length > 0 && article.system.language === "default" ? (
              <Tags
                tags={topicNames}
                orientation="horizontal"
                className="mt-4"
                itemId={article.system.id}
                elementCodename="topics"
              />
            ) : null}
          </div>
          <div className="flex-1">
            <img
              width={670}
              height={440}
              src={article.elements.image.value[0]?.url ?? ""}
              alt={article.elements.image.value[0]?.description ?? ""}
              className="rounded-lg w-[670px] h-[440px] object-cover"
            />
          </div>
        </div>
      </PageSection>

      <PageSection color="bg-white">
        <div className="flex flex-col gap-12 mx-auto items-center max-w-fit">
          <p
            className="text-body-xl text-body-color font-[600] w-[728px] max-w-[728px]"
            {...createItemSmartLink(article.system.id)}
            {...createElementSmartLink("introduction")}
          >
            {article.elements.introduction.value}
          </p>
          <div
            className="rich-text-body flex mx-auto flex-col gap-5 items-center max-w-[728px]"
            {...createItemSmartLink(article.system.id)}
            {...createElementSmartLink("body_copy")}
          >
            <PortableText
              value={transformToPortableText(article.elements.body_copy?.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </div>
      </PageSection>

      {author && authorImage ? (
        <PageSection color="bg-creme">
          <div className="creme-theme flex gap-24 max-w-[728px] mx-auto py-[104px] items-center ">
            <h2 className="text-heading-2 text-heading-2-color">Author</h2>
            <div className="text-body-lg text-body-color">
              <PersonCard
                prefix={author.elements.prefix?.value}
                firstName={author.elements.first_name?.value || ""}
                lastName={author.elements.last_name?.value || ""}
                suffix={author.elements.suffixes?.value}
                jobTitle={author.elements.job_title?.value || ""}
                image={authorImage}
              />
            </div>
          </div>
        </PageSection>
      ) : null}

      {relatedArticleItems.length > 0 ? (
        <PageSection color="bg-white">
          <div className="flex flex-col max-w-6xl mx-auto py-[104px]">
            <h2 className="text-heading-2 text-heading-2-color">Related articles</h2>
            <ArticleList articles={relatedArticleItems} />
          </div>
        </PageSection>
      ) : null}
    </div>
  );
};

export default ArticleDetailPage;
