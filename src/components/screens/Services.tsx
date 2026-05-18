import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { KontentImage } from "@/components/KontentImage.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import { ServiceList } from "@/components/services/ServiceList.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import type { Page, Service } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";
import { defaultPortableRichTextResolvers, isEmptyRichText } from "@/utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  locale: SupportedLanguage;
}>;

export const Services = async ({ envId, apiKey, isPreviewEnabled, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });

  const [servicesPage, services] = await Promise.all([
    client
      .item<Page>("services")
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
      .items<Service>()
      .type("service")
      .languageParameter(locale)
      .equalsFilter("system.language", locale)
      .toPromise()
      .then((res) => res.data.items),
  ]);

  if (!servicesPage) {
    return <div className="flex-grow" />;
  }

  const serviceItems = services.map((service) => ({
    image: {
      url: service.elements.image.value[0]?.url ?? "",
      alt: service.elements.image.value[0]?.description ?? "",
    },
    name: service.elements.name.value,
    summary: service.elements.summary.value,
    tags: service.elements.medical_specialties.value.map((s) => s.name),
    urlSlug: service.elements.url_slug.value,
  }));

  return (
    <div className="flex flex-col gap-12">
      <PageSection color="bg-creme">
        <div className="flex flex-col-reverse gap-16 lg:gap-0 lg:flex-row items-center py-16 lg:py-0 lg:pt-[104px] lg:pb-[160px]">
          <div className="flex flex-col flex-1 gap-6 ">
            <h1
              className="text-heading-1 text-heading-1-color"
              {...createItemSmartLink(servicesPage.item.system.id)}
              {...createElementSmartLink("headline")}
            >
              {servicesPage.item.elements.headline.value}
            </h1>
            <p
              className="text-body-lg text-body-color"
              {...createItemSmartLink(servicesPage.item.system.id)}
              {...createElementSmartLink("subheadline")}
            >
              {servicesPage.item.elements.subheadline.value}
            </p>
          </div>
          <div
            className="flex flex-col flex-1"
            {...createItemSmartLink(servicesPage.item.system.id)}
            {...createElementSmartLink("hero_image")}
          >
            <KontentImage
              src={servicesPage.item.elements.hero_image?.value[0]?.url}
              alt={servicesPage.item.elements.hero_image?.value[0]?.description ?? ""}
              width={670}
              height={440}
              className="rounded-lg"
              isPriority={true}
            />
          </div>
        </div>
      </PageSection>
      {!isEmptyRichText(servicesPage.item.elements.body.value) && (
        <PageSection color="bg-white">
          <div
            className="flex flex-col pt-16 mx-auto gap-6"
            {...createItemSmartLink(servicesPage.item.system.id)}
            {...createElementSmartLink("body")}
          >
            <PortableText
              value={transformToPortableText(servicesPage.item.elements.body.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>
        </PageSection>
      )}
      <PageSection color="bg-white">
        <ServiceList services={serviceItems} />
      </PageSection>
    </div>
  );
};
