import { draftMode } from "next/headers";
import type { NextRequest } from "next/server";
import { redirectToPath } from "@/lib/redirectToPath.ts";
import { sanitizeReturnTo } from "@/lib/sanitizeReturnTo.ts";

export async function GET(req: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  return redirectToPath(sanitizeReturnTo(req.nextUrl.searchParams.get("returnTo")));
}
