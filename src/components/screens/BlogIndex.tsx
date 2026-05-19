import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { getTranslations } from "next-intl/server";
import { BlogList } from "@/components/blog/BlogList.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import type { BlogPost, Page } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "@/utils/richtext.tsx";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  locale: SupportedLanguage;
}>;

export const BlogIndex = async ({ envId, apiKey, isPreviewEnabled, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const t = await getTranslations({ locale, namespace: "blogIndex" });

  const [blogPage, blogs] = await Promise.all([
    client
      .item<Page>("blog")
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
      .items<BlogPost>()
      .type("blog_post")
      .languageParameter(locale)
      .equalsFilter("system.language", locale)
      .toPromise()
      .then((res) => res.data.items),
  ]);

  if (!blogPage) {
    return <div className="flex-grow" />;
  }

  const blogList = blogs.map((b) => ({
    id: b.system.id,
    imageSrc: b.elements.image?.value[0]?.url,
    title: b.elements.title?.value,
    description: transformToPortableText(b.elements.body?.value),
    readMoreLink: b.elements.url_slug.value,
  }));

  return (
    <div>
      <PageSection color="bg-creme">
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-40 pt-28 pb-32 items-center">
          <h1 className="text-8xl text-burgundy font-bold font-libre">{t("title")}</h1>
          <p className="max-w-3xl text-xl leading-relaxed text-gray font-sans">{t("intro")}</p>
        </div>
      </PageSection>
      {!isEmptyRichText(blogPage.item.elements.body.value) && (
        <PageSection color="bg-white">
          <div className="flex flex-col pt-16 mx-auto gap-6">
            <PortableText
              value={transformToPortableText(blogPage.item.elements.body.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </PageSection>
      )}
      <div className="pt-[72px]">
        <BlogList blogs={blogList} />
      </div>
    </div>
  );
};
