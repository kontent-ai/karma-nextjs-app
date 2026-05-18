"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { Selector, type SelectorOption } from "@/components/Selector.tsx";

type FiltersClientProps = Readonly<{
  articleTypes: ReadonlyArray<SelectorOption>;
  articleTopics: ReadonlyArray<SelectorOption>;
}>;

const labelForCodename = (
  options: ReadonlyArray<SelectorOption>,
  codename: string | null,
  fallback: string,
): string => {
  if (!codename) {
    return fallback;
  }
  return options.find((o) => o.codename === codename)?.label ?? fallback;
};

export const FiltersClient: FC<FiltersClientProps> = ({ articleTypes, articleTopics }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allLabel = t("filters.all");

  const setParam = (key: "type" | "topic", value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const typeValue = labelForCodename(articleTypes, searchParams.get("type"), allLabel);
  const topicValue = labelForCodename(articleTopics, searchParams.get("topic"), allLabel);

  return (
    <div className="flex flex-row gap-6 pt-16">
      <Selector
        label={t("filters.articleType")}
        options={articleTypes}
        selectedOption={typeValue}
        onChange={(o) => setParam("type", o.codename)}
      />
      <Selector
        label={t("filters.articleTopic")}
        options={articleTopics}
        selectedOption={topicValue}
        onChange={(o) => setParam("topic", o.codename)}
      />
    </div>
  );
};
