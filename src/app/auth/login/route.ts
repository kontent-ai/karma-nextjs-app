import { type NextRequest, NextResponse } from "next/server";
import { buildAuthorizationUrl } from "@/lib/auth0/flows.ts";
import { sanitizeReturnTo } from "@/lib/sanitizeReturnTo.ts";

export async function GET(req: NextRequest) {
  const returnTo = sanitizeReturnTo(req.nextUrl.searchParams.get("returnTo"));
  const url = await buildAuthorizationUrl({ returnTo });
  return NextResponse.redirect(url);
}
