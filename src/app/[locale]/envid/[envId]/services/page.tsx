import { draftMode } from "next/headers";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { Services } from "@/components/screens/Services.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; locale: SupportedLanguage }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, locale } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return (
    <>
      {isEnabled ? <SmartLinkEnvironment environmentId={envId} languageCodename={locale} /> : null}
      <Services envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} locale={locale} />
    </>
  );
}
