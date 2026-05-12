import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth0/session.ts";

const ENVID_RE = /^\/envid\/([^/]+)(\/.*)?$/;

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Block direct access to internal /site/ tree — only reachable via rewrite.
  if (path.startsWith("/site/")) {
    return new NextResponse(null, { status: 404 });
  }

  // Multi-tenant: /envid/<id>/<rest> — auth-gate then rewrite to /site/<id>/<rest>.
  const match = path.match(ENVID_RE);
  if (match) {
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
      login.searchParams.set("returnTo", path + req.nextUrl.search);
      return NextResponse.redirect(login);
    }

    const url = req.nextUrl.clone();
    url.pathname = `/site/${envId}${rest}`;
    return NextResponse.rewrite(url);
  }

  // Default env: rewrite any other public path to /site/<DEFAULT>/<path>.
  const defaultEnv = process.env.KONTENT_ENVIRONMENT_ID;
  if (!defaultEnv) {
    return new NextResponse("KONTENT_ENVIRONMENT_ID is not configured.", { status: 500 });
  }
  const url = req.nextUrl.clone();
  url.pathname = `/site/${defaultEnv}${path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|kaipurple|api|auth|callback).*)"],
};
