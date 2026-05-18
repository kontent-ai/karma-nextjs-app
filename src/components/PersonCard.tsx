import type { FC } from "react";
import { EnvLink } from "./EnvLink.tsx";
import { KontentImage } from "./KontentImage.tsx";

type PersonCardProps = Readonly<{
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
}>;

export const PersonCard: FC<PersonCardProps> = ({
  prefix,
  firstName,
  lastName,
  suffix,
  jobTitle,
  image,
  codename,
}) => (
  <div className="flex gap-4 items-center">
    <KontentImage
      src={image.url}
      alt={image.alt}
      width={95}
      height={95}
      className="w-[95px] h-[95px] object-cover rounded-full"
    />
    <div className="flex flex-col gap-2 items-start max-w-[325px]">
      <EnvLink
        href={`/our-team/${codename}`}
        className="text-heading-4 underline text-burgundy hover:text-azure"
      >
        {prefix ? <span>{prefix}</span> : null}
        {firstName} {lastName}
        {suffix ? <span>, {suffix}</span> : null}
      </EnvLink>
      <p className="text-small text-grey">{jobTitle}</p>
    </div>
  </div>
);
