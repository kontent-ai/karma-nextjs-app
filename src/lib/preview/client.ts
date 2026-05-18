import type { IContentItem } from "@kontent-ai/delivery-sdk";
import { parse } from "flatted";

export const fetchScreen = async <T>(
  name: string,
  params: Readonly<Record<string, string>>,
): Promise<T> => {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/preview/screen/${name}?${qs}`);
  if (!res.ok) {
    throw new Error(`Preview screen fetch failed: ${res.status}`);
  }
  return parse(await res.text()) as T;
};

export const fetchLinkedItems = async (
  envId: string,
  codenames: ReadonlyArray<string>,
): Promise<ReadonlyArray<IContentItem>> => {
  if (codenames.length === 0) {
    return [];
  }
  const qs = new URLSearchParams({ envId, codenames: codenames.join(",") }).toString();
  const res = await fetch(`/api/preview/items?${qs}`);
  if (!res.ok) {
    throw new Error(`Preview linked-items fetch failed: ${res.status}`);
  }
  return parse(await res.text()) as ReadonlyArray<IContentItem>;
};
