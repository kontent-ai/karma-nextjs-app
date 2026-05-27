import type { ImageLoaderProps } from "next/image";

// Wired into next.config.ts as `images.loaderFile` so requests for Kontent
// assets go straight to Kontent's CDN (no extra hop through Next.js image
// optimization) while next/image still generates a width-based srcSet using
// Kontent's `?auto=format&w=&q=` URL params. Non-Kontent sources (local
// public/ assets, other remote hosts) are returned unchanged.
// Prod assets are served from *.kc-usercontent.com; QA from *.devkontentmasters.com.
const KONTENT_ASSET_HOST_SUFFIXES = [".kc-usercontent.com", ".devkontentmasters.com"] as const;

const isKontentAssetUrl = (src: string): boolean => {
  try {
    const { hostname } = new URL(src);
    return KONTENT_ASSET_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
  } catch {
    return false;
  }
};

const kontentLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  if (!isKontentAssetUrl(src)) {
    return src;
  }
  const params = new URLSearchParams();
  params.set("auto", "format");
  params.set("w", String(width));
  if (quality !== undefined) {
    params.set("q", String(quality));
  }
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}${params.toString()}`;
};

export default kontentLoader;
