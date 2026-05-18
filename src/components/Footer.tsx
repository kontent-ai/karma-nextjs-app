"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Divider } from "./Divider.tsx";
import { Logo } from "./Logo.tsx";
import { Navigation } from "./Navigation.tsx";

export const Footer: FC = () => {
  const t = useTranslations();
  return (
    <footer className="w-full">
      <div className="flex flex-col items-center gap-10 py-20">
        <Logo />
        <Navigation />
      </div>
      <Divider />
      <p className="text-[16px] text-gray-light mx-auto w-fit py-[60px]">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
};
