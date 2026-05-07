import { type NextRequest, NextResponse } from "next/server";
import { getAuth0Config } from "@/lib/auth0/config.ts";
import { handleCallback } from "@/lib/auth0/flows.ts";

export async function GET(req: NextRequest) {
  try {
    const { returnTo } = await handleCallback(req.nextUrl);
    return NextResponse.redirect(new URL(returnTo, getAuth0Config().appBaseUrl));
  } catch (err) {
    console.error("Auth0 callback failed:", err);
    return new NextResponse("Authentication failed.", { status: 400 });
  }
}
