import { draftMode } from "next/headers";
import type { ReactNode } from "react";
import { SmartLinkProvider } from "@/components/SmartLinkProvider.tsx";

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ envId: string }>;
}>;

export default async function SiteLayout({ children, params }: Props) {
  const { envId } = await params;
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return <>{children}</>;
  }
  return <SmartLinkProvider environmentId={envId}>{children}</SmartLinkProvider>;
}
