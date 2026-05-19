import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing.ts";
import { getAuth0Config } from "@/lib/auth0/config.ts";
import { getSessionFromRequest } from "@/lib/auth0/session.ts";
import { isDefaultEnv } from "@/lib/env/defaultEnv.ts";

const intlMiddleware = createMiddleware(routing);

// Match /envid/<id>/... with an optional non-default locale segment in front
// (e.g. /envid/abc or /es-ES/envid/abc). The first capture is the envId.
const ENVID_RE = /^(?:\/es-ES)?\/envid\/([^/]+)/;

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const tenantMatch = path.match(ENVID_RE);

  if (tenantMatch) {
    const envId = tenantMatch[1];
    if (envId) {
      const probe = NextResponse.next();
      const session = await getSessionFromRequest(req, probe);
      const cached = session.currentKey;
      // Default env reads its delivery key from env vars; no per-tenant key needed.
      const hasValidKey =
        isDefaultEnv(envId) || (cached?.envId === envId && cached.expiresAt > Date.now());
      const isValid = session.isAuthed === true && hasValidKey;

      if (!isValid) {
        const login = new URL("/auth/login", getAuth0Config().appBaseUrl);
        login.searchParams.set("returnTo", path + req.nextUrl.search);
        return NextResponse.redirect(login);
      }
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|auth|callback|_next|.*\\..*).*)"],
};
