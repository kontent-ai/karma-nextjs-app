import type { FC } from "react";
import { HeroImage } from "@/components/HeroImage.tsx";
import { FeaturedContent } from "@/components/landingPage/FeaturedContent.tsx";
import { PageContent } from "@/components/PageContent.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import type { LandingPageItem } from "@/lib/screens/landing.ts";

type Props = Readonly<{
  landingPage: LandingPageItem | null;
}>;

export const LandingView: FC<Props> = ({ landingPage }) => {
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
};
