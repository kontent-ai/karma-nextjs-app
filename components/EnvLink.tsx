"use client";

import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import type { ComponentProps, FC } from "react";
import { useAppContext } from "@/context/AppContext.tsx";

type Props = Omit<ComponentProps<typeof NextLink>, "href"> &
  Readonly<{
    href: string;
  }>;

const isInternalAbsolute = (href: string) => href.startsWith("/");

export const EnvLink: FC<Props> = ({ href, ...rest }) => {
  const { urlPrefix } = useAppContext();
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
