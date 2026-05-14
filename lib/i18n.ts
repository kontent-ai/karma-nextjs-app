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

// Parses the optional [[...lang]] catch-all segment of a research detail route.
// Returns the validated non-default language, `undefined` for the default
// language (no segment), or `null` when the segment is malformed (route 404s).
export const parseLangSegment = (
  segments: string[] | undefined,
): Exclude<SupportedLanguage, "default"> | undefined | null => {
  const [first, ...rest] = segments ?? [];
  if (first === undefined) {
    return undefined;
  }
  if (rest.length === 0 && isNonDefaultLanguage(first)) {
    return first;
  }
  return null;
};
