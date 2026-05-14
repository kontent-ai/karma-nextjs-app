const required = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }
  return value;
};

export const getDefaultEnv = () => ({
  envId: required("KONTENT_ENVIRONMENT_ID", process.env.KONTENT_ENVIRONMENT_ID),
  apiKey: required("KONTENT_DELIVERY_API_KEY", process.env.KONTENT_DELIVERY_API_KEY),
});

// The default environment's delivery key lives in env vars, so it never needs
// a per-tenant key resolved from the session via the IAPI.
export const isDefaultEnv = (envId: string): boolean =>
  envId === process.env.KONTENT_ENVIRONMENT_ID;
