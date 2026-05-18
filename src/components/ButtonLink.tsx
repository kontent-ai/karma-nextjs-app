import type { FC, ReactNode } from "react";
import { EnvLink } from "./EnvLink.tsx";

type ButtonLinkProps = Readonly<{
  href: string;
  children: ReactNode;
  variant?: "azure" | "transparent";
  className?: string;
}>;

export const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  children,
  variant = "transparent",
  className = "",
}) => (
  <EnvLink
    href={href.startsWith("/") ? href : `/${href}`}
    className={`${
      variant === "azure" ? "button-azure" : ""
    } inline-block w-fit px-16 py-3 text-body-lg font-semibold text-button-text-color hover:text-button-text-hover-color bg-button-background-color hover:bg-button-background-hover-color border-2 border-button-border-color hover:border-button-border-hover-color rounded-full transition-colors duration-200 ${className}`}
  >
    {children}
  </EnvLink>
);
