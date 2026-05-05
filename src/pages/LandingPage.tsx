import { DeliveryError } from "@kontent-ai/delivery-sdk";

import HeroImage from "../components/HeroImage.tsx";
import PageContent from "../components/PageContent.tsx";
import PageSection from "../components/PageSection.tsx";
import "../index.css";
import { useSuspenseQueries } from "@tanstack/react-query";
import type { FC } from "react";
import FeaturedContent from "../components/landingPage/FeaturedContent.tsx";
import { useSmartLinkRefetch } from "../context/SmartLinkContext.tsx";
import type { LandingPage as LandingPageType } from "../model/index.ts";
import type { Replace } from "../utils/types.ts";
import { useDeliveryClient } from "../utils/useDeliveryClient.ts";

const LandingPage: FC = () => {
  const { client, environmentId, isPreviewEnabled } = useDeliveryClient();

  const [landingPage] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["landing_page", environmentId, isPreviewEnabled],
        queryFn: async () =>
          client
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
            }),
      },
    ],
  });

  useSmartLinkRefetch(landingPage.refetch);

  if (!landingPage.data || !Object.entries(landingPage.data.elements).length) {
    return <div className="flex-grow" />;
  }

  return (
    <div className="flex-grow">
      <PageSection color="bg-burgundy">
        <HeroImage
          data={{
            headline: landingPage.data.elements.headline,
            subheadline: landingPage.data.elements.subheadline,
            heroImage: landingPage.data.elements.hero_image,
            itemId: landingPage.data.system.id,
          }}
        />
      </PageSection>
      {landingPage.data.elements.body_copy ? (
        <PageSection color="bg-white">
          <PageContent
            body={landingPage.data.elements.body_copy}
            itemId={landingPage.data.system.id}
          />
        </PageSection>
      ) : null}
      {landingPage.data.elements.featured_content ? (
        <FeaturedContent
          featuredContent={landingPage.data.elements.featured_content}
          parentId={landingPage.data.system.id}
        />
      ) : null}
    </div>
  );
};

export default LandingPage;
