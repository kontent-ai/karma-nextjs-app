import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getAuth0Config } from "@/lib/auth0/config.ts";

export async function GET(req: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  const returnTo = req.nextUrl.searchParams.get("returnTo") ?? "/";
  return NextResponse.redirect(new URL(returnTo, getAuth0Config().appBaseUrl));
}
