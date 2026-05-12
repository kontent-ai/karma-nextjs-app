import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { draftMode } from "next/headers";
import { HeroImage } from "@/components/HeroImage.tsx";
import { FeaturedContent } from "@/components/landingPage/FeaturedContent.tsx";
import { PageContent } from "@/components/PageContent.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";
import type { LandingPage as LandingPageType } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import type { Replace } from "@/utils/types.ts";

type Props = Readonly<{
  params: Promise<{ envId: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled: isPreviewEnabled } = await draftMode();
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });

  const landingPage = await client
    .items()
    .type("landing_page")
    .limitParameter(1)
    .toPromise()
    .then(
      (res) =>
        (res.data.items[0] as Replace<
          LandingPageType,
          { elements: Partial<LandingPageType["elements"]> }
        >) ?? null,
    )
    .catch((err) => {
      if (err instanceof DeliveryError) {
        return null;
      }
      throw err;
    });

  if (!landingPage || !Object.entries(landingPage.elements).length) {
    return <div className="flex-grow" />;
  }

  return (
    <div className="flex-grow">
      <PageSection color="bg-burgundy">
        <HeroImage
          data={{
            headline: landingPage.elements.headline,
            subheadline: landingPage.elements.subheadline,
            heroImage: landingPage.elements.hero_image,
            itemId: landingPage.system.id,
          }}
        />
      </PageSection>
      {landingPage.elements.body_copy ? (
        <PageSection color="bg-white">
          <PageContent body={landingPage.elements.body_copy} itemId={landingPage.system.id} />
        </PageSection>
      ) : null}
      {landingPage.elements.featured_content ? (
        <FeaturedContent
          featuredContent={landingPage.elements.featured_content}
          parentId={landingPage.system.id}
        />
      ) : null}
    </div>
  );
}
