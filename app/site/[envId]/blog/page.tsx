import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { draftMode } from "next/headers";
import { BlogList } from "@/components/blog/BlogList.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";
import type { BlogPost, Page } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "@/utils/richtext.tsx";

type Props = Readonly<{
  params: Promise<{ envId: string }>;
}>;

export default async function BlogPage({ params }: Props) {
  const { envId } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled: isPreviewEnabled } = await draftMode();
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });

  const [blogPage, blogs] = await Promise.all([
    client
      .item<Page>("blog")
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
          <h1 className="text-8xl text-burgundy font-bold font-libre">Blog</h1>
          <p className="max-w-3xl text-xl leading-relaxed text-gray font-sans">
            Welcome to the Karma Health blog section, where we share insightful thought leadership
            and engaging blog posts from experts within our institution. Stay tuned for the latest
            trends, research, and discussions in the healthcare industry.
          </p>
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
}
