import Image from "next/image";
import type { FC } from "react";

type SharedProps = {
  src: string | undefined;
  alt: string;
  className?: string;
  isPriority?: boolean;
  quality?: number;
  sizes?: string;
};

type FixedProps = SharedProps & {
  width: number;
  height: number;
  fill?: false;
};

type FillProps = SharedProps & {
  fill: true;
  width?: never;
  height?: never;
};

type KontentImageProps = Readonly<FixedProps | FillProps>;

export const KontentImage: FC<KontentImageProps> = (props) => {
  const { src, alt, className, isPriority = false, quality, sizes } = props;

  if (!src) {
    return null;
  }

  if (props.fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={true}
        className={className}
        priority={isPriority}
        quality={quality}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={props.width}
      height={props.height}
      className={className}
      priority={isPriority}
      quality={quality}
      sizes={sizes}
    />
  );
};
