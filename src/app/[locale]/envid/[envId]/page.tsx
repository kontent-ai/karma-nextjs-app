import { draftMode } from "next/headers";
import { Landing } from "@/components/screens/Landing.tsx";
import { LandingPreview } from "@/components/screens/LandingPreview.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; locale: SupportedLanguage }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, locale } = await params;
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return <LandingPreview envId={envId} locale={locale} />;
  }
  const apiKey = await resolveApiKey(envId);
  return <Landing envId={envId} apiKey={apiKey} isPreviewEnabled={false} locale={locale} />;
}
