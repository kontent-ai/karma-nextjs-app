import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { getAuth0Config, SESSION_COOKIE_NAME, TEMP_COOKIE_NAME } from "./config.ts";

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

export type TempData = {
  codeVerifier: string;
  state: string;
  nonce: string;
  returnTo: string;
};

const buildTempOptions = (): SessionOptions => ({
  password: getAuth0Config().sessionPassword,
  cookieName: TEMP_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 10,
  },
});

export const getTempSession = async () =>
  getIronSession<TempData>(await cookies(), buildTempOptions());
