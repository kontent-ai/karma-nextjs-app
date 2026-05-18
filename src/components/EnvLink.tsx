"use client";

import type { ComponentProps, FC } from "react";
import { Link, usePathname } from "@/i18n/routing.ts";

type Props = Omit<ComponentProps<typeof Link>, "href"> &
  Readonly<{
    href: string;
  }>;

const ENV_PREFIX_PATTERN = /^\/envid\/[^/]+/;

const isInternalAbsolute = (href: string) => href.startsWith("/");

export const EnvLink: FC<Props> = ({ href, ...rest }) => {
  const pathname = usePathname();
  const envMatch = pathname.match(ENV_PREFIX_PATTERN);
  const envPrefix = envMatch?.[0] ?? "";

  const finalHref = isInternalAbsolute(href) ? `${envPrefix}${href}` : href;
  return <Link href={finalHref} {...rest} />;
};
