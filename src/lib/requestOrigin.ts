import type { NextRequest } from "next/server";

// Public origin of the incoming request. Prefers x-forwarded-* headers so the
// origin is correct behind reverse proxies (Vercel sets both); falls back to
// the URL Next.js built from the Host header. Forwarded headers may hold a
// comma-separated chain — the first entry is the client-facing hop.
// The headers are client-controllable, so use this only for URLs Auth0 checks
// against its Allowed Callback / Logout URLs; redirect within the app via
// redirectToPath instead.
const getFirstForwardedValue = (req: NextRequest, header: string): string | undefined => {
  const first = req.headers.get(header)?.split(",")[0]?.trim();
  return first === "" ? undefined : first;
};

export const getRequestOrigin = (req: NextRequest): string => {
  const protocol =
    getFirstForwardedValue(req, "x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  const host = getFirstForwardedValue(req, "x-forwarded-host") ?? req.nextUrl.host;
  return `${protocol}://${host}`;
};
