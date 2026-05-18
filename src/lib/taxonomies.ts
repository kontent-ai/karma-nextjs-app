type Translator = {
  (key: string): string;
  has: (key: string) => boolean;
};

// Kontent taxonomies aren't language-variant aware: terms have one `name`
// and `codename`. Translate the display name app-side via dictionary lookup;
// fall back to the Kontent-supplied `name` when no entry exists for the codename.
export const translateTaxonomyTerm = (t: Translator, codename: string, fallback: string): string =>
  t.has(codename) ? t(codename) : fallback;
