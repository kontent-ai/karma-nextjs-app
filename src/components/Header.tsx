import type { FC } from "react";
import { Container } from "./Container.tsx";
import { LanguageSwitcher } from "./LanguageSwitcher.tsx";
import { Logo } from "./Logo.tsx";
import { Navigation } from "./Navigation.tsx";

export const Header: FC = () => (
  <Container>
    <div className="py-8 flex flex-col gap-8 xl:gap-0 lg:flex-row items-center justify-between">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-12 xl:gap-32 items-center list-none">
        <Logo />
        <Navigation />
      </div>
      <LanguageSwitcher />
    </div>
  </Container>
);
