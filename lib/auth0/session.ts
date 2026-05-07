import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { getAuth0Config } from "./config.ts";

const SESSION_COOKIE_NAME = "kdd_session";
const LOGIN_FLOW_COOKIE_NAME = "kdd_login_flow";

export type CachedKey = Readonly<{
  envId: string;
  apiKey: string;
  expiresAt: number;
}>;

export type SessionData = {
  authed?: boolean;
  currentKey?: CachedKey;
};

// SameSite=None + Secure so the cookie is sent when the app runs inside
// Kontent's preview iframe (third-party context). SameSite=None requires
// Secure, which means the dev server must run on HTTPS
// (`next dev --experimental-https`).
const buildSessionOptions = (): SessionOptions => ({
  password: getAuth0Config().sessionPassword,
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  },
});

export const getSession = async () =>
  getIronSession<SessionData>(await cookies(), buildSessionOptions());

export const getSessionFromRequest = (req: NextRequest, res: NextResponse) =>
  getIronSession<SessionData>(req, res, buildSessionOptions());

// In-flight OAuth login state — set on /auth/login, consumed once on /callback.
// Auto-expires after 10 minutes if the user abandons the flow.
export type LoginFlowState = {
  codeVerifier: string;
  state: string;
  nonce: string;
  returnTo: string;
};

const buildLoginFlowOptions = (): SessionOptions => ({
  password: getAuth0Config().sessionPassword,
  cookieName: LOGIN_FLOW_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 10,
  },
});

export const getLoginFlowSession = async () =>
  getIronSession<LoginFlowState>(await cookies(), buildLoginFlowOptions());
