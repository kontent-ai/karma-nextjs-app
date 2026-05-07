"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";
import { IconButton } from "@/icons/IconButton.tsx";
import IconSpain from "@/icons/IconSpain.tsx";
import IconUnitedStates from "@/icons/IconUnitedStates.tsx";
import { Container } from "./Container.tsx";
import { Logo } from "./Logo.tsx";
import { Navigation } from "./Navigation.tsx";

export const Header: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isResearchPage = pathname.match(/^(\/envid\/[^/]+)?\/research\/[\w-]+$/);
  const lang = searchParams.get("lang");

  const buildHref = (nextLang: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (nextLang === null) {
      params.delete("lang");
    } else {
      params.set("lang", nextLang);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <Container>
      <div className="py-8 flex flex-col gap-8 xl:gap-0 lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-12 xl:gap-32 items-center list-none">
          <Logo />
          <Navigation />
        </div>
        {isResearchPage && (
          <div className="flex gap-2 xl:pr-16 justify-self-end items-center">
            <IconButton
              icon={<IconUnitedStates className={`hover:cursor-pointer hover:scale-110`} />}
              isSelected={lang === "en-US" || lang === null}
              onClick={() => router.replace(buildHref(null))}
            />
            <IconButton
              icon={<IconSpain className={`hover:cursor-pointer hover:scale-110`} />}
              isSelected={lang === "es-ES"}
              onClick={() => router.replace(buildHref("es-ES"))}
            />
          </div>
        )}
      </div>
    </Container>
  );
};
