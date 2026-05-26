import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { KontentImage } from "@/components/KontentImage.tsx";
import { PageSection } from "@/components/PageSection.tsx";
import type { Person } from "@/model/index.ts";
import { defaultPortableRichTextResolvers } from "@/utils/richtext.tsx";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";

type Props = Readonly<{
  person: Person;
}>;

export const TeamMemberView: FC<Props> = ({ person }) => {
  const t = useTranslations();
  const hasContact =
    Boolean(person.elements.phone?.value) ||
    Boolean(person.elements.email?.value) ||
    Boolean(person.elements.website?.value);

  return (
    <div className="flex flex-col">
      <PageSection color="bg-azure">
        <div className="azure-theme flex flex-col lg:flex-row justify-between items-start gap-16 pt-[104px] pb-[160px]">
          <div className="flex flex-col gap-6 max-w-[728px]">
            <div className="w-fit text-body-xs text-white border border-white px-4 py-2 rounded-lg uppercase tracking-wider font-bold">
              {t("personDetail.typeLabel")}
            </div>
            <h1
              className="text-heading-1 text-heading-1-color"
              {...createItemSmartLink(person.system.id)}
            >
              {person.elements.prefix?.value ? <span>{person.elements.prefix.value}</span> : null}
              &nbsp;
              {person.elements.first_name?.value} {person.elements.last_name?.value}
              {person.elements.suffixes?.value ? (
                <span>, {person.elements.suffixes.value}</span>
              ) : null}
            </h1>
            <p
              className="text-[32px] leading-[130%] text-body-color"
              {...createItemSmartLink(person.system.id)}
              {...createElementSmartLink("job_title")}
            >
              {person.elements.job_title?.value}
            </p>
          </div>

          <div
            className="flex-1 flex justify-end"
            {...createItemSmartLink(person.system.id)}
            {...createElementSmartLink("image")}
          >
            <div className="relative w-[550px] h-[440px] max-w-full rounded-lg overflow-hidden">
              <KontentImage
                src={person.elements.image?.value[0]?.url}
                alt={
                  person.elements.image?.value[0]?.description ??
                  `Photo of ${person.elements.first_name?.value} ${person.elements.last_name?.value}`
                }
                fill={true}
                sizes="550px"
                className="object-cover"
                isPriority={true}
              />
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection color="bg-white">
        <div className="flex flex-col lg:flex-row gap-16 py-16 max-w-6xl mx-auto justify-center">
          <div
            className="prose prose-lg"
            {...createItemSmartLink(person.system.id)}
            {...createElementSmartLink("biography")}
          >
            <PortableText
              value={transformToPortableText(person.elements.biography?.value)}
              components={defaultPortableRichTextResolvers}
            />
          </div>

          {hasContact ? (
            <div className="flex-1 flex flex-col gap-10">
              <h2 className="text-heading-2 text-burgundy">{t("personDetail.contact")}</h2>

              <div className="flex flex-col gap">
                {person.elements.phone?.value ? (
                  <div
                    {...createItemSmartLink(person.system.id)}
                    {...createElementSmartLink("phone")}
                  >
                    <p className="text-body-lg text-grey-600 mb-1">
                      <span className="font-bold">{t("personDetail.phone")}:</span>{" "}
                      {person.elements.phone.value}
                    </p>
                  </div>
                ) : null}

                {person.elements.email?.value ? (
                  <div
                    {...createItemSmartLink(person.system.id)}
                    {...createElementSmartLink("email")}
                  >
                    <p className="text-body-lg text-grey-600 mb-1">
                      <span className="font-bold">{t("personDetail.email")}:</span>&nbsp;
                      <a
                        href={`mailto:${person.elements.email.value}`}
                        className="text-burgundy hover:text-azure underline"
                      >
                        {person.elements.email.value}
                      </a>
                    </p>
                  </div>
                ) : null}

                {person.elements.website?.value ? (
                  <div
                    {...createItemSmartLink(person.system.id)}
                    {...createElementSmartLink("website")}
                  >
                    <p className="text-body-lg text-grey-600 mb-1">
                      <span className="font-[700]">{t("personDetail.website")}:</span>&nbsp;
                      <a
                        href={person.elements.website.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-burgundy hover:text-azure underline"
                      >
                        {person.elements.website.value}
                      </a>
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </PageSection>
    </div>
  );
};
