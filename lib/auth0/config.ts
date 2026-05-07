const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getAuth0Config = () => ({
  domain: requireEnv("AUTH0_DOMAIN"),
  clientId: requireEnv("AUTH0_CLIENT_ID"),
  appBaseUrl: requireEnv("APP_BASE_URL"),
  sessionPassword: requireEnv("SESSION_PASSWORD"),
});

export const getIssuer = () => `https://${getAuth0Config().domain}`;
export const getRedirectUri = () => `${getAuth0Config().appBaseUrl}/callback`;
export const defaultScope = "openid profile email offline_access";

export const SESSION_COOKIE_NAME = "kdd_session";
export const TEMP_COOKIE_NAME = "kdd_auth_tmp";
