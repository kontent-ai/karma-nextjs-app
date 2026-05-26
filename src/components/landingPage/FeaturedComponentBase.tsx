"use client";

import { useTranslations } from "next-intl";
import type { FC, PropsWithChildren } from "react";
import { KontentImage } from "../KontentImage.tsx";

type FeaturedComponentBaseProps = PropsWithChildren<
  Readonly<{
    type: "article" | "event";
    image?: {
      url: string;
      alt: string;
    };
    isFeatured?: boolean;
  }>
>;

export const FeaturedComponentBase: FC<FeaturedComponentBaseProps> = ({
  type,
  image,
  children,
  isFeatured = false,
}) => {
  const t = useTranslations();
  const label = type === "event" ? t("featured.event") : t("featured.article");
  return (
    <div className="flex flex-col gap-5 lg:gap-16 lg:flex-row py-5 lg:py-[104px] items-center">
      <div className="basis-auto">
        {image ? (
          <div className="relative w-[440px] h-[280px] rounded-lg overflow-hidden">
            {isFeatured ? (
              <span className="px-3.5 py-1.5 absolute z-10 text-body-xs bg-azure text-white mt-4 ms-4 rounded-md font-bold uppercase">
                {label}
              </span>
            ) : null}
            <KontentImage
              src={image.url}
              alt={image.alt ?? "image alt"}
              fill={true}
              sizes="440px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
      <div className="basis-auto">{children}</div>
    </div>
  );
};
