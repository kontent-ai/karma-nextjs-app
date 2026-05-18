export type LoadResult<T> =
  | { readonly kind: "found"; readonly item: T }
  | { readonly kind: "notTranslated" }
  | { readonly kind: "notFound" };
