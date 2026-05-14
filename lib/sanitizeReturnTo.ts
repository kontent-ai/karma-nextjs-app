// Guards against open redirects: only same-origin absolute paths are allowed.
// Rejects protocol-relative URLs ("//evil.com"), which slip past a naive
// startsWith("/") check yet resolve to a foreign origin via `new URL()`.
export const sanitizeReturnTo = (returnTo: string | null | undefined): string =>
  returnTo?.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/";
