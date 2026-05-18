import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { ImageWithTag } from "@/components/ImageWithTag.tsx";
import { KontentImage } from "@/components/KontentImage.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { ArticleListWithFilters } from "@/components/research/ArticleListWithFilters.tsx";
import type { SelectorOption } from "@/components/Selector.tsx";
import { Tags } from "@/components/Tags.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { translateTaxonomyTerm } from "@/lib/taxonomies.ts";
import type { Article, Page } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "@/utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  locale: SupportedLanguage;
}>;

const LOCALE_TO_BCP47: Record<SupportedLanguage, string> = {
  default: "en-US",
  "es-ES": "es-ES",
};

type FeaturedArticleViewProps = Readonly<{
  image: { url: string; alt: string; width: number; height: number };
  title: string;
  published: string;
  tags: ReadonlyArray<string>;
  description: string;
  urlSlug: string;
  readMoreLabel: string;
  featuredLabel: string;
}>;

const FeaturedArticleView = ({
  image,
  title,
  published,
  tags,
  description,
  urlSlug,
  readMoreLabel,
  featuredLabel,
}: FeaturedArticleViewProps) => (
  <div className="flex flex-col lg:flex-row items-center pt-[104px] pb-[120px] gap-12">
    <ImageWithTag
      image={{ url: image.url, alt: image.alt, width: image.width, height: image.height }}
      tagText={featuredLabel}
      className="lg:basis-1/2 xl:basis-2/5"
    />
    <div className="lg:basis-1/2 xl:basis-3/5">
      <h2 className="text-heading-2 text-heading-2-color">{title}</h2>
      <p className="text-body-md text-body-color pt-4">{published}</p>
      <Tags tags={tags} className="mt-4" />
      <p className="text-body-lg text-body-color pt-3">{description}</p>
      <ButtonLink href={`/research/${urlSlug}`} className="mt-6">
        {readMoreLabel}
      </ButtonLink>
    </div>
  </div>
);

export const Research = async ({ envId, apiKey, isPreviewEnabled, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const t = await getTranslations({ locale });
  const tArticleType = await getTranslations({ locale, namespace: "articleType" });
  const tTopics = await getTranslations({ locale, namespace: "generalHealthcareTopics" });
  const bcp47 = LOCALE_TO_BCP47[locale];

  const [articlesPage, articleTypeTerms, topicTerms, articles] = await Promise.all([
    client
      .item<Page>("research")
      .languageParameter(locale)
      .toPromise()
      .then((res) => res.data)
      .catch((err) => {
        if (err instanceof DeliveryError) {
          return null;
        }
        throw err;
      }),
    client
      .taxonomy("article_type")
      .toPromise()
      .then((res) => res.data.taxonomy.terms),
    client
      .taxonomy("general_healthcare_topics")
      .toPromise()
      .then((res) => res.data.taxonomy.terms),
    client
      .items<Article>()
      .type("article")
      .languageParameter(locale)
      .equalsFilter("system.language", locale)
      .orderByDescending("elements.publish_date")
      .toPromise()
      .then((res) => res.data.items),
  ]);

  if (!articlesPage) {
    return <div className="flex-grow" />;
  }

  const allLabel = t("filters.all");
  const articlesTypes: ReadonlyArray<SelectorOption> = [
    { label: allLabel, codename: "all" },
    ...articleTypeTerms.map((term) => ({
      label: translateTaxonomyTerm(tArticleType, term.codename, term.name),
      codename: term.codename,
    })),
  ];
  const articlesTopics: ReadonlyArray<SelectorOption> = [
    { label: allLabel, codename: "all" },
    ...topicTerms.map((term) => ({
      label: translateTaxonomyTerm(tTopics, term.codename, term.name),
      codename: term.codename,
    })),
  ];

  const formatLongDate = (iso: string) =>
    new Date(iso).toLocaleDateString(bcp47, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString(bcp47, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const featured = articles[0];
  const featuredArticle = featured
    ? {
        image: {
          url: featured.elements.image.value[0]?.url ?? "",
          alt: featured.elements.image.value[0]?.description ?? "",
          width: 670,
          height: 440,
        },
        title: featured.elements.title.value,
        published: `${t("article.publishedOn")} ${formatShortDate(
          featured.elements.publish_date.value ?? "",
        )}`,
        tags: featured.elements.topics.value.map((tag) =>
          translateTaxonomyTerm(tTopics, tag.codename, tag.name),
        ),
        description: featured.elements.introduction.value,
        urlSlug: featured.elements.url_slug.value,
      }
    : null;

  const articleListItems = articles.map((article) => ({
    image: {
      url: article.elements.image.value[0]?.url ?? "",
      alt: article.elements.image.value[0]?.description ?? "",
    },
    title: article.elements.title.value,
    introduction: article.elements.introduction.value,
    publishDate: article.elements.publish_date.value
      ? formatLongDate(article.elements.publish_date.value)
      : t("article.noDate"),
    topics: article.elements.topics.value.map((tag) =>
      translateTaxonomyTerm(tTopics, tag.codename, tag.name),
    ),
    urlSlug: article.elements.url_slug.value,
    articleTypeCodenames: article.elements.article_type.value.map((tag) => tag.codename),
    topicCodenames: article.elements.topics.value.map((tag) => tag.codename),
  }));

  return (
    <div className="flex flex-col">
      <PageSection color="bg-creme">
        <div className="flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center py-16 lg:py-0 lg:pt-[104px] lg:pb-[160px]">
          <div className="flex flex-col flex-1 gap-6 ">
            <h1
              className="text-heading-1 text-heading-1-color"
              {...createItemSmartLink(articlesPage.item.system.id)}
              {...createElementSmartLink("headline")}
            >
              {articlesPage.item.elements.headline.value}
            </h1>
            <p
              className="text-body-lg text-body-color"
              {...createItemSmartLink(articlesPage.item.system.id)}
              {...createElementSmartLink("subheadline")}
            >
              {articlesPage.item.elements.subheadline.value}
            </p>
          </div>
          <div
            className="flex flex-col flex-1"
            {...createItemSmartLink(articlesPage.item.system.id)}
            {...createElementSmartLink("hero_image")}
          >
            <KontentImage
              src={articlesPage.item.elements.hero_image?.value[0]?.url}
              alt={articlesPage.item.elements.hero_image?.value[0]?.description ?? ""}
              width={670}
              height={440}
              className="rounded-lg"
              isPriority={true}
            />
          </div>
        </div>
      </PageSection>
      <PageSection color="bg-burgundy">
        {featuredArticle ? (
          <div className="burgundy-theme">
            <FeaturedArticleView
              {...featuredArticle}
              readMoreLabel={t("cta.readMore")}
              featuredLabel={t("featured.article")}
            />
          </div>
        ) : null}
      </PageSection>
      {!isEmptyRichText(articlesPage.item.elements.body.value) && (
        <PageSection color="bg-white">
          <div
            className="flex flex-col pt-10 mx-auto gap-6"
            {...createItemSmartLink(articlesPage.item.system.id)}
            {...createElementSmartLink("body")}
          >
            <PortableText
              value={transformToPortableText(articlesPage.item.elements.body.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </PageSection>
      )}
      <Suspense>
        <ArticleListWithFilters
          articleTypes={articlesTypes}
          articleTopics={articlesTopics}
          articles={articleListItems}
        />
      </Suspense>
    </div>
  );
};
