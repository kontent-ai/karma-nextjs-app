import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const draft = await draftMode();
  draft.enable();
  const returnTo = req.nextUrl.searchParams.get("returnTo") ?? "/";
  return NextResponse.redirect(new URL(returnTo, req.url));
}
