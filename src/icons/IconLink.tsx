import Link from "next/link";
import type { FC, ReactNode } from "react";

type IconLinkProps = Readonly<{
  href: string;
  icon: ReactNode;
  className?: string;
  isSelected?: boolean;
}>;

export const IconLink: FC<IconLinkProps> = ({ href, icon, className, isSelected }) => (
  <Link
    href={href}
    replace={true}
    className={`w-fit h-fit text-[0px] ${className} ${isSelected ? "border-[3px] border-azure rounded-full" : ""}  `}
  >
    {icon}
  </Link>
);
