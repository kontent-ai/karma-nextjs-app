import { cookies, draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getAuth0Config } from "@/lib/auth0/config.ts";
import { sanitizeReturnTo } from "@/lib/sanitizeReturnTo.ts";

// Next.js sets __prerender_bypass with SameSite=Lax by default, which blocks
// the cookie in cross-site iframe contexts (Web Spotlight). Re-set it with
// SameSite=None + Secure so Draft Mode survives there. Mirrors the iron-session
// cookie options in lib/auth0/session.ts. Requires HTTPS in dev.
export async function GET(req: NextRequest) {
  const draft = await draftMode();
  draft.enable();

  const cookieStore = await cookies();
  const bypass = cookieStore.get("__prerender_bypass");
  if (bypass) {
    cookieStore.set({
      name: bypass.name,
      value: bypass.value,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  }

  const returnTo = sanitizeReturnTo(req.nextUrl.searchParams.get("returnTo"));
  return NextResponse.redirect(new URL(returnTo, getAuth0Config().appBaseUrl));
}
