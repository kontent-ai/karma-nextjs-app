import { type NextRequest, NextResponse } from "next/server";
import { getAuth0Config } from "@/lib/auth0/config.ts";
import { handleCallback } from "@/lib/auth0/flows.ts";

export async function GET(req: NextRequest) {
  try {
    // openid-client requires a real URL instance; NextURL is not one. Rebuild
    // against APP_BASE_URL so the callback reflects the public origin, not :3001.
    const callbackUrl = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      getAuth0Config().appBaseUrl,
    );
    const { returnTo } = await handleCallback(callbackUrl);
    return NextResponse.redirect(new URL(returnTo, getAuth0Config().appBaseUrl));
  } catch (err) {
    console.error("Auth0 callback failed:", err);
    return new NextResponse("Authentication failed.", { status: 400 });
  }
}
