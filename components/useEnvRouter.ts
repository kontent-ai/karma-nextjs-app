"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext.tsx";

const isInternalAbsolute = (href: string) => href.startsWith("/");

export const useEnvRouter = () => {
  const router = useRouter();
  const { urlPrefix } = useAppContext();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const prefix = (href: string) => {
    if (!isInternalAbsolute(href)) {
      return href;
    }
    const [path, search = ""] = href.split("?");
    const params = new URLSearchParams(search);
    if (isPreview && !params.has("preview")) {
      params.set("preview", "true");
    }
    const qs = params.toString();
    return qs ? `${urlPrefix}${path}?${qs}` : `${urlPrefix}${path}`;
  };

  return {
    ...router,
    push: (href: string, opts?: Parameters<typeof router.push>[1]) =>
      router.push(prefix(href), opts),
    replace: (href: string, opts?: Parameters<typeof router.replace>[1]) =>
      router.replace(prefix(href), opts),
  };
};
