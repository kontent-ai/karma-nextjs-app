import type { FC } from "react";

const KONTENT_ASSET_HOST_PATTERN =
  /^https?:\/\/(assets|preview-assets)[^/]*\.kc-usercontent\.com\//;

const isKontentAsset = (url: string): boolean => KONTENT_ASSET_HOST_PATTERN.test(url);

const buildKontentImageUrl = (
  src: string,
  width: number,
  dpr: 1 | 2,
  quality?: number,
): string => {
  if (!isKontentAsset(src)) {
    return src;
  }
  const params = new URLSearchParams();
  params.set("auto", "format");
  params.set("w", String(width));
  if (dpr !== 1) {
    params.set("dpr", String(dpr));
  }
  if (quality !== undefined) {
    params.set("q", String(quality));
  }
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}${params.toString()}`;
};

type KontentImageProps = Readonly<{
  src: string | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  isPriority?: boolean;
  quality?: number;
}>;

export const KontentImage: FC<KontentImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  isPriority = false,
  quality,
}) => {
  if (!src) {
    return null;
  }

  const src1x = buildKontentImageUrl(src, width, 1, quality);
  const src2x = buildKontentImageUrl(src, width, 2, quality);
  const srcSet = src1x === src2x ? undefined : `${src1x} 1x, ${src2x} 2x`;

  return (
    // biome-ignore lint/performance/noImgElement: Kontent CDN handles optimization (auto/format, dpr, q); next/image isn't needed.
    <img
      src={src1x}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={isPriority ? undefined : "lazy"}
      decoding="async"
      fetchPriority={isPriority ? "high" : "low"}
    />
  );
};
