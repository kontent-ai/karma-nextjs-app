import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ButtonLink.tsx";
import { ImageWithTag } from "@/components/ImageWithTag.tsx";
import { KontentImage } from "@/components/KontentImage.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { ArticleListWithFilters } from "@/components/research/ArticleListWithFilters.tsx";
import type { SelectorOption } from "@/components/Selector.tsx";
import { Tags } from "@/components/Tags.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";
import type { Article, Page } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "@/utils/richtext.tsx";

export const revalidate = 60;
export const dynamicParams = true;

export const generateStaticParams = async () => [{ envId: process.env.KONTENT_ENVIRONMENT_ID! }];

type Props = Readonly<{
  params: Promise<{ envId: string }>;
}>;

const selectTaxonomyOptions = (taxonomy: {
  terms: ReadonlyArray<{ name: string; codename: string }>;
}): ReadonlyArray<SelectorOption> => [
  { label: "All", codename: "all" },
  ...taxonomy.terms.map((t) => ({ label: t.name, codename: t.codename })),
];

type FeaturedArticleViewProps = Readonly<{
  image: { url: string; alt: string; width: number; height: number };
  title: string;
  published: string;
  tags: ReadonlyArray<string>;
  description: string;
  urlSlug: string;
}>;

const FeaturedArticleView = ({
  image,
  title,
  published,
  tags,
  description,
  urlSlug,
}: FeaturedArticleViewProps) => (
  <div className="flex flex-col lg:flex-row items-center pt-[104px] pb-[120px] gap-12">
    <ImageWithTag
      image={{ url: image.url, alt: image.alt, width: image.width, height: image.height }}
      tagText="Featured Article"
      className="lg:basis-1/2 xl:basis-2/5"
    />
    <div className="lg:basis-1/2 xl:basis-3/5">
      <h2 className="text-heading-2 text-heading-2-color">{title}</h2>
      <p className="text-body-md text-body-color pt-4">{published}</p>
      <Tags tags={tags} className="mt-4" />
      <p className="text-body-lg text-body-color pt-3">{description}</p>
      <ButtonLink href={`/research/${urlSlug}`} className="mt-6">
        Read More
      </ButtonLink>
    </div>
  </div>
);

export default async function ResearchPage({ params }: Props) {
  const { envId } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled: isPreviewEnabled } = await draftMode();
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });

  const [articlesPage, articlesTypes, articlesTopics, articles] = await Promise.all([
    client
      .item<Page>("research")
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
      .then((res) => selectTaxonomyOptions(res.data.taxonomy)),
    client
      .taxonomy("general_healthcare_topics")
      .toPromise()
      .then((res) => selectTaxonomyOptions(res.data.taxonomy)),
    client
      .items<Article>()
      .type("article")
      .orderByDescending("elements.publish_date")
      .toPromise()
      .then((res) => res.data.items),
  ]);

  if (!articlesPage) {
    return <div className="flex-grow" />;
  }

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
        published: `Published on ${new Date(
          featured.elements.publish_date.value ?? "",
        ).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          day: "numeric",
        })}`,
        tags: featured.elements.topics.value.map((t) => t.name),
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
      ? new Date(article.elements.publish_date.value).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "No date",
    topics: article.elements.topics.value.map((t) => t.name),
    urlSlug: article.elements.url_slug.value,
    articleTypeCodenames: article.elements.article_type.value.map((t) => t.codename),
    topicCodenames: article.elements.topics.value.map((t) => t.codename),
  }));

  return (
    <div className="flex flex-col">
      <PageSection color="bg-creme">
        <div className="flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center py-16 lg:py-0 lg:pt-[104px] lg:pb-[160px]">
          <div className="flex flex-col flex-1 gap-6 ">
            <h1 className="text-heading-1 text-heading-1-color">
              {articlesPage.item.elements.headline.value}
            </h1>
            <p className="text-body-lg text-body-color">
              {articlesPage.item.elements.subheadline.value}
            </p>
          </div>
          <div className="flex flex-col flex-1">
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
            <FeaturedArticleView {...featuredArticle} />
          </div>
        ) : null}
      </PageSection>
      {!isEmptyRichText(articlesPage.item.elements.body.value) && (
        <PageSection color="bg-white">
          <div className="flex flex-col pt-10 mx-auto gap-6">
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
}
