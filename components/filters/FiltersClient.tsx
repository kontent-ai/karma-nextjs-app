"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";
import { Selector, type SelectorOption } from "@/components/Selector.tsx";

type FiltersClientProps = Readonly<{
  articleTypes: ReadonlyArray<SelectorOption>;
  articleTopics: ReadonlyArray<SelectorOption>;
}>;

const labelForCodename = (
  options: ReadonlyArray<SelectorOption>,
  codename: string | null,
): string => {
  if (!codename) {
    return "All";
  }
  return options.find((o) => o.codename === codename)?.label ?? "All";
};

export const FiltersClient: FC<FiltersClientProps> = ({ articleTypes, articleTopics }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const typeValue = labelForCodename(articleTypes, searchParams.get("type"));
  const topicValue = labelForCodename(articleTopics, searchParams.get("topic"));

  return (
    <div className="flex flex-row gap-6 pt-16">
      <Selector
        label="Article Type"
        options={articleTypes}
        selectedOption={typeValue}
        onChange={(o) => setParam("type", o.codename)}
      />
      <Selector
        label="Article Topic"
        options={articleTopics}
        selectedOption={topicValue}
        onChange={(o) => setParam("topic", o.codename)}
      />
    </div>
  );
};
