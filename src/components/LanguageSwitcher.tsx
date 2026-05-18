"use client";

import { useLocale } from "next-intl";
import type { FC, ReactNode } from "react";
import { Link, routing, type SupportedLanguage, usePathname } from "@/i18n/routing.ts";
import IconSpain from "@/icons/IconSpain.tsx";
import IconUnitedStates from "@/icons/IconUnitedStates.tsx";

const LOCALE_ICONS: Record<SupportedLanguage, ReactNode> = {
  default: <IconUnitedStates className="hover:cursor-pointer hover:scale-110" />,
  "es-ES": <IconSpain className="hover:cursor-pointer hover:scale-110" />,
};

export const LanguageSwitcher: FC = () => {
  const pathname = usePathname();
  const currentLocale = useLocale() as SupportedLanguage;

  return (
    <div className="flex gap-2 xl:pr-16 justify-self-end items-center">
      {routing.locales.map((target) => {
        const isSelected = target === currentLocale;
        return (
          <Link
            key={target}
            href={pathname}
            locale={target}
            replace={true}
            aria-current={isSelected ? "page" : undefined}
            className={isSelected ? "opacity-100" : "opacity-50 hover:opacity-100"}
          >
            {LOCALE_ICONS[target]}
          </Link>
        );
      })}
    </div>
  );
};
