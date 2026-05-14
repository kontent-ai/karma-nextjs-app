import type { LanguageCodenames } from "@/model/system/delivery.codenames.ts";

export type SupportedLanguage = Extract<LanguageCodenames, "default" | "es-ES">;

export const DEFAULT_LANGUAGE: SupportedLanguage = "default";

export const NON_DEFAULT_LANGUAGES = ["es-ES"] as const satisfies readonly SupportedLanguage[];

export const ALL_LANGUAGES: readonly SupportedLanguage[] = [
  DEFAULT_LANGUAGE,
  ...NON_DEFAULT_LANGUAGES,
];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  default: "English",
  "es-ES": "Español",
};

export const isNonDefaultLanguage = (
  value: string,
): value is Exclude<SupportedLanguage, "default"> =>
  (NON_DEFAULT_LANGUAGES as readonly string[]).includes(value);

export const buildArticleHref = (slug: string, lang: SupportedLanguage) =>
  lang === DEFAULT_LANGUAGE ? `/research/${slug}` : `/research/${slug}/${lang}`;
