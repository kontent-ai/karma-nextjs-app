import { draftMode } from "next/headers";
import { SmartLinkEnvironment } from "@/components/SmartLinkProvider.tsx";
import { OurTeam } from "@/components/screens/OurTeam.tsx";
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
  return (
    <>
      {isEnabled ? <SmartLinkEnvironment environmentId={envId} languageCodename={locale} /> : null}
      <OurTeam envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} locale={locale} />
    </>
  );
}
