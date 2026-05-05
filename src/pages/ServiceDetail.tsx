import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import type { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type FC, useCallback, useMemo } from "react";
import { NavLink, useSearchParams } from "react-router";
import { useParams } from "react-router-dom";
import PageSection from "../components/PageSection.tsx";
import Tags from "../components/Tags.tsx";
import { useAppContext } from "../context/AppContext.tsx";
import { useCustomRefresh } from "../context/SmartLinkContext.tsx";
import type { Person, Service } from "../model/index.ts";
import { createClient } from "../utils/client.ts";
import { NotFoundError } from "../utils/errors.ts";
import { createPreviewLink } from "../utils/link.ts";
import { defaultPortableRichTextResolvers } from "../utils/richtext.tsx";

const TeamMemberCard: FC<{
  prefix?: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  jobTitle: string;
  image: {
    url?: string;
    alt: string;
  };
  codename: string;
}> = ({ prefix, firstName, lastName, suffix, jobTitle, image, codename }) => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  return (
    <div className="flex gap-4 items-center">
      <img
        src={image.url}
        alt={image.alt}
        className="w-[95px] h-[95px] object-cover rounded-full"
      />
      <div className="flex flex-col gap-2 items-start">
        <NavLink
          to={createPreviewLink(`/our-team/${codename}`, isPreview)}
          className="text-heading-4 underline text-burgundy hover:text-azure"
        >
          {prefix ? <span>{prefix}</span> : null}
          {firstName} {lastName}
          {suffix ? <span>, {suffix}</span> : null}
        </NavLink>
        <p className="text-small text-grey text-center">{jobTitle}</p>
      </div>
    </div>
  );
};

const ServiceDetail: FC = () => {
  const { environmentId, apiKey } = useAppContext();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const serviceData = useSuspenseQuery({
    queryKey: ["service-detail", slug, environmentId, isPreview],
    queryFn: async () => {
      const res = await createClient(environmentId, apiKey, isPreview)
        .items<Service>()
        .type("service")
        .equalsFilter("elements.url_slug", slug ?? "")
        .toPromise();
      const service = res.data.items[0];
      if (!service) {
        throw new NotFoundError(`Service '${slug}' not found`);
      }
      return service;
    },
  });

  const onRefresh = useCallback(
    (_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        serviceData.refetch();
      }
    },
    [serviceData],
  );

  useCustomRefresh(onRefresh);

  const service = serviceData.data;

  const medicalSpecialtyNames = useMemo(
    () => service.elements.medical_specialties.value.map((specialty) => specialty.name),
    [service.elements.medical_specialties.value],
  );

  return (
    <div className="flex flex-col gap-12">
      <PageSection color="bg-azure">
        <div className="azure-theme flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center pt-[104px] pb-[160px]">
          <div className="flex flex-col flex-1 gap-6">
            <div className="w-fit text-small text-body-color border tracking-wider font-[700] border-white px-4 py-2 rounded-lg uppercase">
              Service
            </div>
            <h1 className="text-heading-1 text-heading-1-color max-w-[12ch]">
              {service.elements.name.value}
            </h1>
            <p className="text-body-lg text-body-color text-[32px] leading-[130%]">
              {service.elements.summary.value}
            </p>
          </div>
          <div className="flex flex-col flex-1">
            <img
              width={670}
              height={440}
              src={service.elements.image.value[0]?.url ?? ""}
              alt={service.elements.image.value[0]?.description ?? ""}
              className="rounded-lg w-[670px] h-[440px]"
            />
          </div>
        </div>
      </PageSection>

      <PageSection color="bg-white">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 max-w-6xl mx-auto">
          <div className="rich-text-body lg:basis-2/3 flex-mx-auto flex flex-col gap-5">
            <PortableText
              value={transformToPortableText(service.elements.description?.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>

          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-10">
              <h2 className="text-heading-2 text-burgundy">Medical Specialties</h2>
              <Tags tags={medicalSpecialtyNames} orientation="vertical" />
            </div>

            {service.elements.team?.value.length > 0 && (
              <div className="max-w-3xl">
                <h2 className="text-heading-2 text-burgundy mb-10">Team</h2>
                <div className="flex flex-col gap-6">
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

export default ServiceDetail;
