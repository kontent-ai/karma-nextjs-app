import { getSession } from "@/lib/auth0/session.ts";
import { isDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const resolveApiKey = async (envId: string): Promise<string> => {
  if (isDefaultEnv(envId)) {
    const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
    if (!apiKey) {
      throw new Error("Missing KONTENT_DELIVERY_API_KEY environment variable.");
    }
    return apiKey;
  }

  const session = await getSession();
  const cached = session.currentKey;
  if (cached?.envId !== envId || cached.expiresAt <= Date.now()) {
    throw new Error(`No valid cached delivery key for environment ${envId}.`);
  }
  return cached.apiKey;
};
