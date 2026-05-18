"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { ServiceListItem } from "./ServiceListItem.tsx";

type ServiceData = Readonly<{
  image: {
    url: string;
    alt: string;
  };
  name: string;
  summary: string;
  tags: ReadonlyArray<string>;
  urlSlug: string;
}>;

type ServiceListProps = Readonly<{
  services: ReadonlyArray<ServiceData>;
}>;

export const ServiceList: FC<ServiceListProps> = ({ services }) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-[104px]">
      {services.length === 0 ? (
        <p className="text-center text-grey text-xl">{t("services.noServices")}</p>
      ) : (
        services.map((service) => (
          <ServiceListItem
            key={service.urlSlug}
            image={service.image}
            name={service.name}
            summary={service.summary}
            tags={service.tags}
            slug={service.urlSlug}
          />
        ))
      )}
    </div>
  );
};
