"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { EnvLink } from "./EnvLink.tsx";

const navLinks: ReadonlyArray<{ key: string; path: string }> = [
  { key: "nav.home", path: "/" },
  { key: "nav.services", path: "/services" },
  { key: "nav.ourTeam", path: "/our-team" },
  { key: "nav.research", path: "/research" },
  { key: "nav.blog", path: "/blog" },
];

export const Navigation: FC = () => {
  const t = useTranslations();
  return (
    <nav>
      <menu className="flex flex-col lg:flex-row gap-5 lg:gap-[60px] items-center list-none">
        {navLinks.map(({ key, path }) => (
          <li key={key}>
            <EnvLink
              href={path}
              className="text-xl leading-5 text-gray w-fit block hover:text-burgundy"
            >
              {t(key)}
            </EnvLink>
          </li>
        ))}
      </menu>
    </nav>
  );
};
