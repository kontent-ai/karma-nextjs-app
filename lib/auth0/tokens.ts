import "server-only";

import { refreshTokens } from "./flows.ts";
import { getSession } from "./session.ts";

const REFRESH_LEEWAY_MS = 60 * 1000;

type GetAccessTokenArgs = Readonly<{
  audience: string;
}>;

export const getAccessToken = async ({ audience }: GetAccessTokenArgs): Promise<string> => {
  const session = await getSession();
  const tokenSet = session.tokens?.[audience];
  if (!tokenSet) {
    throw new Error(
      `No access token in session for audience ${audience}. The user must re-authenticate.`,
    );
  }

  const isExpired = Date.now() + REFRESH_LEEWAY_MS >= tokenSet.expiresAt;
  if (!isExpired) {
    return tokenSet.accessToken;
  }

  if (!tokenSet.refreshToken) {
    throw new Error(
      `Access token for ${audience} expired and no refresh token available. The user must re-authenticate.`,
    );
  }

  const refreshed = await refreshTokens(tokenSet.refreshToken, audience);
  session.tokens = { ...(session.tokens ?? {}), [audience]: refreshed };
  await session.save();
  return refreshed.accessToken;
};

export const hasSession = async (): Promise<boolean> => {
  const session = await getSession();
  return Boolean(session.user);
};
