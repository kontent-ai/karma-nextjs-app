import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { KontentImage } from "@/components/KontentImage.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { TeamMemberList } from "@/components/team/TeamMemberList.tsx";
import type { Page, Person } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "@/utils/richtext.tsx";
import { getApiKey, getEnvContextBase } from "../_lib/getEnvContext.ts";

type Props = Readonly<{
  searchParams: Promise<{ preview?: string }>;
}>;

export default async function OurTeamPage({ searchParams }: Props) {
  const isPreviewEnabled = (await searchParams).preview === "true";
  const { environmentId } = await getEnvContextBase();
  const apiKey = await getApiKey();
  const client = getDeliveryClient({ environmentId, apiKey, isPreviewEnabled });

  const [teamPage, teamMembers] = await Promise.all([
    client
      .item<Page>("our_team")
      .toPromise()
      .then((res) => res.data)
      .catch((err) => {
        if (err instanceof DeliveryError) {
          return null;
        }
        throw err;
      }),
    client
      .items<Person>()
      .type("person")
      .toPromise()
      .then((res) => res.data.items),
  ]);

  if (!teamPage) {
    return <div className="flex-grow" />;
  }

  const memberItems = teamMembers.map((member) => ({
    image: {
      url: member.elements.image.value[0]?.url ?? "",
      alt:
        member.elements.image.value[0]?.description ??
        `${member.elements.first_name.value} ${member.elements.last_name.value}`,
    },
    prefix: member.elements.prefix.value,
    suffix: member.elements.suffixes.value,
    firstName: member.elements.first_name.value,
    lastName: member.elements.last_name.value,
    position: member.elements.job_title.value,
    link: member.system.codename,
  }));

  return (
    <div className="flex flex-col gap-12">
      <PageSection color="bg-creme">
        <div className="flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center py-16 lg:py-0 lg:pt-[104px] lg:pb-[160px]">
          <div className="flex flex-col flex-1 gap-6">
            <h1 className="text-heading-1 text-heading-1-color">
              {teamPage.item.elements.headline.value}
            </h1>
            <p className="text-body-lg text-body-color">
              {teamPage.item.elements.subheadline.value}
            </p>
          </div>
          <div className="flex flex-col flex-1">
            <KontentImage
              src={teamPage.item.elements.hero_image?.value[0]?.url}
              alt={teamPage.item.elements.hero_image?.value[0]?.description ?? ""}
              width={670}
              height={440}
              className="rounded-lg"
              isPriority={true}
            />
          </div>
        </div>
      </PageSection>

      {!isEmptyRichText(teamPage.item.elements.body.value) && (
        <PageSection color="bg-white">
          <div className="flex flex-col pt-10 mx-auto gap-6">
            <PortableText
              value={transformToPortableText(teamPage.item.elements.body.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </PageSection>
      )}
      <PageSection color="bg-white">
        <div className="pb-[160px] pt-[104px]">
          <TeamMemberList teamMembers={memberItems} />
        </div>
      </PageSection>
    </div>
  );
}
