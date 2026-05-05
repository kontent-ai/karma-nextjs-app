import type { FC, ReactNode } from "react";
import { NavLink, useSearchParams } from "react-router";
import { createPreviewLink } from "../utils/link.ts";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "azure" | "transparent";
  className?: string;
}

const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  children,
  variant = "transparent",
  className = "",
}) => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  return (
    <NavLink
      to={createPreviewLink(href, isPreview)}
      className={`${
        variant === "azure" ? "button-azure" : ""
      } inline-block w-fit px-16 py-3 text-body-lg font-semibold text-button-text-color hover:text-button-text-hover-color bg-button-background-color hover:bg-button-background-hover-color border-2 border-button-border-color hover:border-button-border-hover-color rounded-full transition-colors duration-200 ${className}`}
    >
      {children}
    </NavLink>
  );
};

export default ButtonLink;
