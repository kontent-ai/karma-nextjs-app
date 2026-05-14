"use client";

import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";
import { IconButton } from "@/icons/IconButton.tsx";
import IconSpain from "@/icons/IconSpain.tsx";
import IconUnitedStates from "@/icons/IconUnitedStates.tsx";
import { Container } from "./Container.tsx";
import { Logo } from "./Logo.tsx";
import { Navigation } from "./Navigation.tsx";

const RESEARCH_PATH_RE = /^(\/envid\/[^/]+)?\/research\/([\w-]+)(?:\/([\w-]+))?$/;

export const Header: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const match = pathname.match(RESEARCH_PATH_RE);
  const isResearchPage = match !== null;
  const envPrefix = match?.[1] ?? "";
  const slug = match?.[2] ?? "";
  const currentLang = match?.[3] ?? "default";

  const buildHref = (nextLang: "default" | "es-ES") =>
    nextLang === "default"
      ? `${envPrefix}/research/${slug}`
      : `${envPrefix}/research/${slug}/${nextLang}`;

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
              icon={<IconUnitedStates className="hover:cursor-pointer hover:scale-110" />}
              isSelected={currentLang === "default"}
              onClick={() => router.replace(buildHref("default"))}
            />
            <IconButton
              icon={<IconSpain className="hover:cursor-pointer hover:scale-110" />}
              isSelected={currentLang === "es-ES"}
              onClick={() => router.replace(buildHref("es-ES"))}
            />
          </div>
        )}
      </div>
    </Container>
  );
};
