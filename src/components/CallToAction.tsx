import type { FC } from "react";
import {
  createComponentSmartLink,
  createElementSmartLink,
  createItemSmartLink,
} from "../utils/smartlink.ts";
import ButtonLink from "./ButtonLink.tsx";

type CallToActionProps = Readonly<{
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageSrc?: string;
  imageAlt: string;
  imagePosition?: "left" | "right" | "center";
  variant?: "burgundy" | "default";
  parentId: string;
  componentId: string | null;
}>;

const CallToAction: FC<CallToActionProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt,
  imagePosition = "left",
  variant = "default",
  parentId,
  componentId,
}) => {
  const calculateLayout = (imagePosition: "left" | "right" | "center") => {
    if (imagePosition === "left") {
      return "lg:flex-row";
    } else if (imagePosition === "right") {
      return "lg:flex-row-reverse";
    }
    return "";
  };

  return (
    <div
      className={`${variant === "burgundy" ? "burgundy-theme" : ""} flex flex-col ${calculateLayout(
        imagePosition,
      )} items-center gap-16`}
    >
      <div className="rounded-lg xl:w-[560px] lg:w-[420px]">
        <img
          src={imageSrc}
          width={560}
          height={420}
          alt={imageAlt}
          className="rounded object-fit"
        />
      </div>

      <div
        className={`flex lg:flex-1 flex-col gap-5 ${imagePosition === "center" ? "items-center" : ""}`}
      >
        <h2
          className={`flex w-fit text-6xl font-bold text-heading-2-color`}
          {...createItemSmartLink(parentId)}
          {...createElementSmartLink("headline")}
          {...(componentId && createComponentSmartLink(componentId))}
        >
          {title}
        </h2>

        <p
          className={`flex text-xl text-body-color line-clamp-5`}
          {...createItemSmartLink(parentId)}
          {...createElementSmartLink("subheadline")}
          {...(componentId && createComponentSmartLink(componentId))}
        >
          {description}
        </p>

        <div className="flex pt-5">
          <ButtonLink href={buttonHref}>{buttonText}</ButtonLink>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
