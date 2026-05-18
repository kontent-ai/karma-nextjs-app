import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  children: ReactNode;
}>;

export default function TenantLayout({ children }: Props) {
  return <>{children}</>;
}
