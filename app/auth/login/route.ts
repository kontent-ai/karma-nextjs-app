import { type NextRequest, NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/auth0/flows.ts";

export async function GET(req: NextRequest) {
  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/";
  const safeReturnTo = returnTo.startsWith("/") ? returnTo : "/";
  const url = await buildAuthorizationUrl({ returnTo: safeReturnTo });
  return NextResponse.redirect(url);
}
