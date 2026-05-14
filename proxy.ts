import { type NextRequest, NextResponse } from "next/server";
import { getAuth0Config } from "@/lib/auth0/config.ts";
import { getSessionFromRequest } from "@/lib/auth0/session.ts";

const ENVID_RE = /^\/envid\/([^/]+)(\/.*)?$/;

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const match = path.match(ENVID_RE);
  if (!match) {
    return NextResponse.next();
  }

  const envId = match[1];
  if (!envId) {
    return NextResponse.next();
  }

  const probe = NextResponse.next();
  const session = await getSessionFromRequest(req, probe);
  const cached = session.currentKey;
  const isValid =
    session.authed === true && cached?.envId === envId && cached.expiresAt > Date.now();

  if (!isValid) {
    const login = new URL("/auth/login", getAuth0Config().appBaseUrl);
    login.searchParams.set("returnTo", path + req.nextUrl.search);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/envid/:path*"],
};
