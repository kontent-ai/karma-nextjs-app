import { type NextRequest, NextResponse } from "next/server";
import { handleCallback } from "@/lib/auth0/flows.ts";
import { redirectToPath } from "@/lib/redirectToPath.ts";
import { getRequestOrigin } from "@/lib/requestOrigin.ts";

export async function GET(req: NextRequest) {
  try {
    // openid-client derives the token-exchange redirect_uri from this URL, so
    // it must byte-match the redirect_uri sent in the authorization request.
    // Both are built from the request origin, so they agree by construction.
    // (Also: openid-client requires a real URL instance; NextURL is not one.)
    const origin = getRequestOrigin(req);
    const callbackUrl = new URL(req.nextUrl.pathname + req.nextUrl.search, origin);
    const { returnTo } = await handleCallback(callbackUrl);
    return redirectToPath(returnTo);
  } catch (err) {
    console.error("Auth0 callback failed:", err);
    return new NextResponse("Authentication failed.", { status: 400 });
  }
}
