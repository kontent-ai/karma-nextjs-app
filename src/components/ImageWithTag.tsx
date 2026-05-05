import type { FC } from "react";
import KontentImage from "./KontentImage.tsx";

type ImageWithTagProps = Readonly<{
  image: Readonly<{
    url?: string;
    alt: string;
    width: number;
    height: number;
  }>;
  tagText: string;
  className?: string;
}>;

const ImageWithTag: FC<ImageWithTagProps> = ({ image, tagText, className }) => {
  return (
    <div className={`relative ${className}`}>
      <span className="px-3.5 py-1.5 absolute text-body-xs bg-azure text-white mt-4 ms-4 rounded-md font-bold">
        {tagText}
      </span>
      <KontentImage
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="object-cover static rounded-lg"
      />
    </div>
  );
};

export default ImageWithTag;
