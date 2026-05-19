import { draftMode } from "next/headers";
import { Research } from "@/components/screens/Research.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";

export const revalidate = 300;

type Props = Readonly<{
  params: Promise<{ locale: SupportedLanguage }>;
}>;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return <Research envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} locale={locale} />;
}
