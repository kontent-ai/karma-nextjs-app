import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth0/session.ts";

const ENVID_RE = /^\/envid\/([^/]+)(\/.*)?$/;

export async function proxy(req: NextRequest) {
  const match = req.nextUrl.pathname.match(ENVID_RE);
  if (!match) {
    return NextResponse.next();
  }

  const envId = match[1];
  const rest = match[2] ?? "/";
  if (!envId) {
    return NextResponse.next();
  }

  const probe = NextResponse.next();
  const session = await getSessionFromRequest(req, probe);
  const cached = session.currentKey;
  const isValid =
    session.authed === true && cached?.envId === envId && cached.expiresAt > Date.now();

  if (!isValid) {
    const login = new URL("/auth/login", req.url);
    login.searchParams.set("returnTo", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }

  const url = req.nextUrl.clone();
  url.pathname = rest;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-kontent-env-id", envId);
  return res;
}

export const config = {
  matcher: ["/envid/:path*"],
};
