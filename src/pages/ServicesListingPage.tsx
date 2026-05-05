import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { useSuspenseQueries } from "@tanstack/react-query";
import type { FC } from "react";
import PageSection from "../components/PageSection.tsx";
import ServiceList from "../components/services/ServiceList.tsx";
import type { Page, Service } from "../model/index.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "../utils/richtext.tsx";
import { useDeliveryClient } from "../utils/useDeliveryClient.ts";

const selectServiceList = (data: ReadonlyArray<Service>) =>
  data.map((service) => ({
    image: {
      url: service.elements.image.value[0]?.url ?? "",
      alt: service.elements.image.value[0]?.description ?? "",
    },
    name: service.elements.name.value,
    summary: service.elements.summary.value,
    tags: service.elements.medical_specialties.value.map((specialty) => specialty.name),
    urlSlug: service.elements.url_slug.value,
  }));

const ServicesListingPage: FC = () => {
  const { client, environmentId, isPreviewEnabled } = useDeliveryClient();

  const [servicesPage, services] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["services_page", environmentId, isPreviewEnabled],
        queryFn: async () =>
          client
            .item<Page>("services")
            .toPromise()
            .then((res) => res.data)
            .catch((err) => {
              if (err instanceof DeliveryError) {
                return null;
              }
              throw err;
            }),
      },
      {
        queryKey: ["services_listing", environmentId, isPreviewEnabled],
        queryFn: async () =>
          client
            .items<Service>()
            .type("service")
            .toPromise()
            .then((res) => res.data.items),
        select: selectServiceList,
      },
    ],
  });

  if (!servicesPage.data) {
    return <div className="flex-grow" />;
  }

  return (
    <div className="flex flex-col gap-12">
      <PageSection color="bg-creme">
        <div className="flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center py-16 lg:py-0 lg:pt-[104px] lg:pb-[160px]">
          <div className="flex flex-col flex-1 gap-6 ">
            <h1 className="text-heading-1 text-heading-1-color">
              {servicesPage.data.item.elements.headline.value}
            </h1>
            <p className="text-body-lg text-body-color">
              {servicesPage.data.item.elements.subheadline.value}
            </p>
          </div>
          <div className="flex flex-col flex-1">
            <img
              width={670}
              height={440}
              src={servicesPage.data.item.elements.hero_image?.value[0]?.url}
              alt={servicesPage.data.item.elements.hero_image?.value[0]?.description ?? ""}
              className="rounded-lg"
            />
          </div>
        </div>
      </PageSection>
      {!isEmptyRichText(servicesPage.data.item.elements.body.value) && (
        <PageSection color="bg-white">
          <div className="flex flex-col pt-16 mx-auto gap-6">
            <PortableText
              value={transformToPortableText(servicesPage.data.item.elements.body.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </PageSection>
      )}
      <PageSection color="bg-white">
        <ServiceList services={services.data} />
      </PageSection>
    </div>
  );
};

export default ServicesListingPage;
