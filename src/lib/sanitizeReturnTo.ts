// Guards against open redirects: only same-origin paths are allowed. The input
// is resolved the way a browser resolves a Location header, which treats "\" as
// "/" and strips tabs and newlines, so "/\evil.com" or "/\t/evil.com" would land
// on evil.com despite starting with a single "/". Returning the normalized path
// (rather than the raw input) keeps those characters out of the redirect.
const PLACEHOLDER_ORIGIN = "http://placeholder.invalid";

export const sanitizeReturnTo = (returnTo: string | null | undefined): string => {
  const url = returnTo?.startsWith("/") ? URL.parse(returnTo, PLACEHOLDER_ORIGIN) : null;
  if (url?.origin !== PLACEHOLDER_ORIGIN) {
    return "/";
  }
  return `${url.pathname}${url.search}${url.hash}`;
};
