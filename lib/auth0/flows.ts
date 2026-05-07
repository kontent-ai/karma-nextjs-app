import { loadPreviewApiKey } from "@/utils/api.ts";
import { defaultScope, getAuth0Config, getIssuer, getRedirectUri } from "./config.ts";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
} from "./pkce.ts";
import { getSession, getTempSession } from "./session.ts";

const KONTENT_AUDIENCE = "https://app.kenticocloud.com/";
const ENVID_RE = /^\/envid\/([^/]+)/;
const KEY_TTL_MS = 8 * 60 * 60 * 1000;

type StartLoginArgs = Readonly<{
  returnTo: string;
}>;

export const buildAuthorizationUrl = async ({ returnTo }: StartLoginArgs): Promise<string> => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();
  const nonce = generateNonce();

  const tempSession = await getTempSession();
  tempSession.codeVerifier = codeVerifier;
  tempSession.state = state;
  tempSession.nonce = nonce;
  tempSession.returnTo = returnTo;
  await tempSession.save();

  const config = getAuth0Config();
  const url = new URL(`${getIssuer()}/authorize`);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", getRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", defaultScope);
  url.searchParams.set("audience", KONTENT_AUDIENCE);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  return url.toString();
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
  token_type: string;
};

const exchangeCodeForTokens = async (
  code: string,
  codeVerifier: string,
): Promise<TokenResponse> => {
  const config = getAuth0Config();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    code,
    redirect_uri: getRedirectUri(),
    code_verifier: codeVerifier,
  });

  const res = await fetch(`${getIssuer()}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth0 token exchange failed: ${res.status} ${err}`);
  }
  return res.json();
};

export const handleCallback = async (callbackUrl: URL): Promise<{ returnTo: string }> => {
  const tempSession = await getTempSession();
  const { codeVerifier, state, returnTo } = tempSession;
  if (!codeVerifier || !state) {
    throw new Error("Missing PKCE verifier or state — login flow not initiated.");
  }

  const callbackState = callbackUrl.searchParams.get("state");
  if (callbackState !== state) {
    throw new Error("OAuth state mismatch.");
  }

  const code = callbackUrl.searchParams.get("code");
  if (!code) {
    const error = callbackUrl.searchParams.get("error_description") ?? "missing code";
    throw new Error(`OAuth callback error: ${error}`);
  }

  const tokens = await exchangeCodeForTokens(code, codeVerifier);

  const session = await getSession();
  session.authed = true;

  const envIdMatch = (returnTo ?? "").match(ENVID_RE);
  const envId = envIdMatch?.[1];
  if (envId) {
    const apiKey = await loadPreviewApiKey({
      accessToken: tokens.access_token,
      environmentId: envId,
    });
    if (!apiKey) {
      throw new Error(`Could not obtain preview API key for environment ${envId}.`);
    }
    session.currentKey = { envId, apiKey, expiresAt: Date.now() + KEY_TTL_MS };
  }

  await session.save();

  tempSession.destroy();
  await tempSession.save();

  return { returnTo: returnTo || "/" };
};

export const buildLogoutUrl = (returnTo: string): string => {
  const config = getAuth0Config();
  const url = new URL(`${getIssuer()}/v2/logout`);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
};
