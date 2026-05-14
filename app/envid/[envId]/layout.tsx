import { draftMode } from "next/headers";
import type { ReactNode } from "react";
import { SmartLinkProvider } from "@/components/SmartLinkProvider.tsx";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ envId: string }>;
}>;

export default async function TenantLayout({ children, params }: Props) {
  const { envId } = await params;
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return <>{children}</>;
  }
  return <SmartLinkProvider environmentId={envId}>{children}</SmartLinkProvider>;
}
