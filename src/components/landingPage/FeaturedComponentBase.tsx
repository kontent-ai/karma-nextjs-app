import type { FC, PropsWithChildren } from "react";

type FeaturedContentProps = PropsWithChildren<
  Readonly<{
    type: "article" | "event";
    image?: {
      url: string;
      alt: string;
    };
    isFeatured?: boolean;
  }>
>;

const FeaturedComponentBase: FC<FeaturedContentProps> = ({
  type,
  image,
  children,
  isFeatured = false,
}) => {
  return (
    <div className="flex flex-col gap-5 lg:gap-16 lg:flex-row py-5 lg:py-[104px] items-center">
      <div className="basis-auto">
        {image ? (
          <>
            {isFeatured ? (
              <span className="px-3.5 py-1.5 absolute text-body-xs bg-azure text-white mt-4 ms-4 rounded-md font-bold">
                {type === "event" ? "FEATURED EVENT" : "FEATURED ARTICLE"}
              </span>
            ) : null}
            <img
              width={440}
              height={280}
              src={image.url ? `${image.url}?auto=format&w=800` : ""}
              alt={image.alt ?? "image alt"}
              className="object-cover rounded-lg static min-w-[440px] min-h-[280px]"
            />
          </>
        ) : null}
      </div>
      <div className="basis-auto">{children}</div>
    </div>
  );
};

export default FeaturedComponentBase;
