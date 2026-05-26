import Image from "next/image";
import type { FC } from "react";

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

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={isPriority}
      quality={quality}
    />
  );
};
