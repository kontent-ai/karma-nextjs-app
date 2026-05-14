import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { notFound } from "next/navigation";
import { KontentImage } from "@/components/KontentImage.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { Tags } from "@/components/Tags.tsx";
import { TeamMemberCard } from "@/components/team/TeamMemberCard.tsx";
import type { Person, Service } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers } from "@/utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
}>;

export const ServiceDetail = async ({ envId, apiKey, isPreviewEnabled, slug }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });

  const res = await client
    .items<Service>()
    .type("service")
    .equalsFilter("elements.url_slug", slug)
    .toPromise();
  const service = res.data.items[0];
  if (!service) {
    notFound();
  }

  const medicalSpecialtyNames = service.elements.medical_specialties.value.map((s) => s.name);

  return (
    <div className="flex flex-col gap-12">
      <PageSection color="bg-azure">
        <div className="azure-theme flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center pt-[104px] pb-[160px]">
          <div className="flex flex-col flex-1 gap-6">
            <div className="w-fit text-small text-body-color border tracking-wider font-[700] border-white px-4 py-2 rounded-lg uppercase">
              Service
            </div>
            <h1
              className="text-heading-1 text-heading-1-color max-w-[12ch]"
              {...createItemSmartLink(service.system.id)}
              {...createElementSmartLink("name")}
            >
              {service.elements.name.value}
            </h1>
            <p
              className="text-body-lg text-body-color text-[32px] leading-[130%]"
              {...createItemSmartLink(service.system.id)}
              {...createElementSmartLink("summary")}
            >
              {service.elements.summary.value}
            </p>
          </div>
          <div
            className="flex flex-col flex-1"
            {...createItemSmartLink(service.system.id)}
            {...createElementSmartLink("image")}
          >
            <KontentImage
              src={service.elements.image.value[0]?.url}
              alt={service.elements.image.value[0]?.description ?? ""}
              width={670}
              height={440}
              className="rounded-lg w-[670px] h-[440px]"
              isPriority={true}
            />
          </div>
        </div>
      </PageSection>

      <PageSection color="bg-white">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 max-w-6xl mx-auto">
          <div
            className="rich-text-body lg:basis-2/3 flex-mx-auto flex flex-col gap-5"
            {...createItemSmartLink(service.system.id)}
            {...createElementSmartLink("description")}
          >
            <PortableText
              value={transformToPortableText(service.elements.description?.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>

          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-10">
              <h2 className="text-heading-2 text-burgundy">Medical Specialties</h2>
              <Tags
                tags={medicalSpecialtyNames}
                orientation="vertical"
                itemId={service.system.id}
                elementCodename="medical_specialties"
              />
            </div>

            {service.elements.team?.value.length > 0 && (
              <div className="max-w-3xl">
                <h2 className="text-heading-2 text-burgundy mb-10">Team</h2>
                <div
                  className="flex flex-col gap-6"
                  {...createItemSmartLink(service.system.id)}
                  {...createElementSmartLink("team")}
                >
                  {service.elements.team.linkedItems.map((person: Person) => (
                    <TeamMemberCard
                      key={person.system.id}
                      prefix={person.elements.prefix?.value}
                      firstName={person.elements.first_name?.value || ""}
                      lastName={person.elements.last_name?.value || ""}
                      suffix={person.elements.suffixes?.value}
                      jobTitle={person.elements.job_title?.value || ""}
                      image={{
                        url: person.elements.image?.value[0]?.url ?? "",
                        alt:
                          person.elements.image?.value[0]?.description ??
                          `Photo of ${person.elements.first_name?.value} ${person.elements.last_name?.value}`,
                      }}
                      codename={person.system.codename}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageSection>
    </div>
  );
};
