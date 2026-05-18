"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, FC } from "react";

type Props = Omit<ComponentProps<typeof NextLink>, "href"> &
  Readonly<{
    href: string;
  }>;

const isInternalAbsolute = (href: string) => href.startsWith("/");
const ENV_PREFIX_PATTERN = /^\/envid\/[^/]+/;

export const EnvLink: FC<Props> = ({ href, ...rest }) => {
  const pathname = usePathname();
  const envMatch = pathname.match(ENV_PREFIX_PATTERN);
  const urlPrefix = envMatch?.[0] ?? "";

  const finalHref = isInternalAbsolute(href) ? `${urlPrefix}${href}` : href;
  return <NextLink href={finalHref} {...rest} />;
};
