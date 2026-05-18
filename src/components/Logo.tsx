"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { EnvLink } from "./EnvLink.tsx";

export const Logo: FC = () => {
  const t = useTranslations();
  return (
    <EnvLink href="/" aria-label={t("nav.logoAriaLabel")} className="flex gap-4 items-center">
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <title>Karma Health logo</title>
        <rect width="40" height="14" y="13" fill="#993265" rx="2.4px" />
        <rect width="14" height="40" x="13" fill="#993265" rx="2.4px" />
      </svg>
      <p className="text-5xl pt-1 text-azure font-libre font-bold text-nowrap">Karma Health</p>
    </EnvLink>
  );
};
