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
}) => (
  <div className="flex flex-col gap-5 lg:gap-16 lg:flex-row py-5 lg:py-[104px] items-center">
    <div className="basis-auto">
      {image ? (
        <>
          {isFeatured ? (
            <span className="px-3.5 py-1.5 absolute text-body-xs bg-azure text-white mt-4 ms-4 rounded-md font-bold">
              {type === "event" ? "FEATURED EVENT" : "FEATURED ARTICLE"}
            </span>
          ) : null}
          <KontentImage
            src={image.url}
            alt={image.alt ?? "image alt"}
            width={440}
            height={280}
            className="object-cover rounded-lg static min-w-[440px] min-h-[280px]"
          />
        </>
      ) : null}
    </div>
    <div className="basis-auto">{children}</div>
  </div>
);
