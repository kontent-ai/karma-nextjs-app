import type { FC } from "react";
import { DisclaimerBase } from "./DisclaimerBase.tsx";

type PromotionalDisclaimerProps = Readonly<{
  title: string;
  text: string;
  parentId: string;
  componentId: string | null;
}>;

export const PromotionalDisclaimer: FC<PromotionalDisclaimerProps> = ({
  title,
  text,
  parentId,
  componentId,
}) => (
  <DisclaimerBase
    title={title}
    text={text}
    parentId={parentId}
    componentId={componentId}
    theme="burgundy"
  />
);
