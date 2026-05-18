import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["default", "es-ES"] as const,
  defaultLocale: "default",
  localePrefix: "as-needed",
});

export type SupportedLanguage = (typeof routing.locales)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  default: "English",
  "es-ES": "Español",
};

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
