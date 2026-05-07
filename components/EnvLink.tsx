"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  let finalHref = href;
  if (isInternalAbsolute(href)) {
    const [path, search = ""] = href.split("?");
    const prefixed = `${urlPrefix}${path}`;
    const params = new URLSearchParams(search);
    if (isPreview && !params.has("preview")) {
      params.set("preview", "true");
    }
    const qs = params.toString();
    finalHref = qs ? `${prefixed}?${qs}` : prefixed;
  }

  return <NextLink href={finalHref} {...rest} />;
};
