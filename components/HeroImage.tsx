import type { Elements } from "@kontent-ai/delivery-sdk";
import type { FC } from "react";
import { createElementSmartLink, createItemSmartLink } from "@/utils/smartlink.ts";
import { ButtonLink } from "./ButtonLink.tsx";
import { KontentImage } from "./KontentImage.tsx";

type HeroImageProps = Readonly<{
  data: {
    headline?: Elements.TextElement;
    subheadline?: Elements.TextElement;
    heroImage?: Elements.AssetsElement;
    itemId?: string;
  };
  buttonLink?: string;
}>;

export const HeroImage: FC<HeroImageProps> = ({ data, buttonLink }) => (
  <div className="burgundy-theme flex flex-col py-10 lg:py-0 lg:flex-row lg:gap-32">
    <div className="lg:basis-1/2 pt-10 lg:pt-[104px] pb-10 lg:pb-[160px] flex flex-col items-center lg:items-start gap-10">
      <h1
        className="text-center lg:text-left font-libre text-[64px] md:text-[94px] text-heading-1-color font-bold leading-[64px] md:leading-[78px]"
        {...createItemSmartLink(data.itemId)}
        {...createElementSmartLink("headline")}
      >
        {data.headline?.value}
      </h1>
      <p
        className="text-center lg:text-left font-sans text-xl text-body-color"
        {...createItemSmartLink(data.itemId)}
        {...createElementSmartLink("subheadline")}
      >
        {data.subheadline?.value}
      </p>

      <ButtonLink href={buttonLink ?? "/services"}>
        <p>Explore our services</p>
      </ButtonLink>
    </div>
    <div
      className="lg:basis-1/2"
      {...createItemSmartLink(data.itemId)}
      {...createElementSmartLink("hero_image")}
    >
      {data.heroImage?.value[0] ? (
        <KontentImage
          src={data.heroImage.value[0].url}
          alt={data.heroImage.value[0].description ?? "image-alt"}
          width={660}
          height={770}
          className="object-cover h-full mx-auto"
          isPriority={true}
        />
      ) : null}
    </div>
  </div>
);
