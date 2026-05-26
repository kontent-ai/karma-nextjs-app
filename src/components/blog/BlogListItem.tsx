"use client";

import type { PortableTextObject } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { EnvLink } from "../EnvLink.tsx";
import { KontentImage } from "../KontentImage.tsx";

type BlogListItemProps = Readonly<{
  imageSrc?: string;
  title: string;
  description: PortableTextObject[];
  readMoreLink: string;
  className?: string;
  isPriority?: boolean;
}>;

export const BlogListItem: FC<BlogListItemProps> = ({
  imageSrc,
  title,
  description,
  readMoreLink,
  className,
  isPriority = false,
}) => {
  const t = useTranslations();
  return (
    <div className={`flex flex-col md:flex-row gap-16 w-full ${className}`}>
      <div className="relative shrink-0 w-[440px] h-[288px] max-w-full rounded-md overflow-hidden">
        <KontentImage
          src={imageSrc}
          alt={title}
          fill={true}
          sizes="440px"
          className="object-cover"
          isPriority={isPriority}
        />
      </div>
      <div className="md:w-2/3 flex flex-col justify-center gap-5">
        <h2 className="text-heading-2 font-libre text-burgundy mb-4">{title}</h2>
        <div className="text-body-lg text-gray mb-4 max-w-3xl line-clamp-4">
          <PortableText value={description} />
        </div>
        <EnvLink
          href={`/blog/${readMoreLink}`}
          className="inline-block text-link-color text-body-lg underline hover:text-link-hover-color"
        >
          {t("cta.readMore")}
        </EnvLink>
      </div>
    </div>
  );
};
