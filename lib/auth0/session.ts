import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { getAuth0Config, SESSION_COOKIE_NAME, TEMP_COOKIE_NAME } from "./config.ts";

export type TokenSet = Readonly<{
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
  audience: string;
  scope: string;
}>;

export type SessionData = {
  user?: {
    sub: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  tokens?: Record<string, TokenSet>;
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
