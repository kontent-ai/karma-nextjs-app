import { createHash, randomBytes } from "node:crypto";

const base64UrlEncode = (input: Buffer): string =>
  input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export const generateCodeVerifier = (): string => base64UrlEncode(randomBytes(32));

export const generateCodeChallenge = (verifier: string): string =>
  base64UrlEncode(createHash("sha256").update(verifier).digest());

export const generateState = (): string => base64UrlEncode(randomBytes(16));

export const generateNonce = (): string => base64UrlEncode(randomBytes(16));
