import * as client from "openid-client";
import { isDefaultEnv } from "@/lib/env/defaultEnv.ts";
import { loadPreviewApiKey } from "@/lib/iapi/loadPreviewApiKey.ts";
import { getAuth0Config } from "./config.ts";
import { getLoginFlowSession, getSession } from "./session.ts";

const KONTENT_AUDIENCE = "https://app.kenticocloud.com/";
const DEFAULT_SCOPE = "openid profile email";
const ENVID_RE = /^\/envid\/([^/]+)/;
const KEY_TTL_MS = 8 * 60 * 60 * 1000;

const configCache = new Map<string, Promise<client.Configuration>>();

const getConfig = async (): Promise<client.Configuration> => {
  const { domain, clientId } = getAuth0Config();
  const key = `${domain}:${clientId}`;
  const existing = configCache.get(key);
  if (existing) {
    return existing;
  }
  // No client secret = public client; openid-client handles this transparently.
  const created = client.discovery(new URL(`https://${domain}`), clientId);
  configCache.set(key, created);
  return created;
};

const getRedirectUri = () => `${getAuth0Config().appBaseUrl}/callback`;

type StartLoginArgs = Readonly<{
  returnTo: string;
}>;

export const buildAuthorizationUrl = async ({ returnTo }: StartLoginArgs): Promise<string> => {
  const config = await getConfig();
  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  const loginFlow = await getLoginFlowSession();
  loginFlow.codeVerifier = codeVerifier;
  loginFlow.state = state;
  loginFlow.nonce = nonce;
  loginFlow.returnTo = returnTo;
  await loginFlow.save();

  const url = client.buildAuthorizationUrl(config, {
    redirect_uri: getRedirectUri(),
    scope: DEFAULT_SCOPE,
    audience: KONTENT_AUDIENCE,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    nonce,
  });
  return url.href;
};

export const handleCallback = async (callbackUrl: URL): Promise<{ returnTo: string }> => {
  const config = await getConfig();
  const loginFlow = await getLoginFlowSession();
  const { codeVerifier, state, nonce, returnTo } = loginFlow;
  if (!codeVerifier || !state || !nonce) {
    throw new Error("Missing PKCE verifier, state, or nonce — login flow not initiated.");
  }

  // Verifies state, nonce, ID-token signature (JWKS), iss/aud/exp claims; exchanges code.
  const tokens = await client.authorizationCodeGrant(config, callbackUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedState: state,
    expectedNonce: nonce,
  });

  const session = await getSession();
  session.authed = true;

  // The default env serves its key from env vars; only non-default tenants need
  // a delivery key resolved via the IAPI and cached on the session.
  const envIdMatch = (returnTo ?? "").match(ENVID_RE);
  const envId = envIdMatch?.[1];
  if (envId && !isDefaultEnv(envId)) {
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

  loginFlow.destroy();
  await loginFlow.save();

  return { returnTo: returnTo || "/" };
};

export const buildLogoutUrl = async (returnTo: string): Promise<string> => {
  const config = await getConfig();
  const url = client.buildEndSessionUrl(config, {
    post_logout_redirect_uri: returnTo,
  });
  return url.href;
};
