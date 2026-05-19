import type { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

export default function TenantLayout({ children }: Props) {
  return <>{children}</>;
}
