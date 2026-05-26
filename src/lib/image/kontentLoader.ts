import type { ImageLoaderProps } from "next/image";

// Wired into next.config.ts as `images.loaderFile` so requests go straight to
// Kontent's CDN (no extra hop through Next.js image optimization) while
// next/image still generates a width-based srcSet using Kontent's
// `?auto=format&w=&q=` URL params.
const kontentLoader = ({ src, width, quality }: ImageLoaderProps): string => {
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
