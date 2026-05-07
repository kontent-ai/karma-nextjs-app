"use client";

import type { FC, MouseEvent, ReactNode } from "react";

type IconButtonProps = Readonly<{
  onClick: (e: MouseEvent) => void;
  icon: ReactNode;
  className?: string;
  isSelected?: boolean;
}>;

export const IconButton: FC<IconButtonProps> = ({ onClick, icon, className, isSelected }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-fit h-fit text-[0px] ${className} ${isSelected ? "border-[3px] border-azure rounded-full" : ""}  `}
  >
    {icon}
  </button>
);
