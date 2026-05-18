import { LandingView } from "@/components/screens/LandingView.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { loadLanding } from "@/lib/screens/landing.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  locale: SupportedLanguage;
}>;

export const Landing = async ({ envId, apiKey, isPreviewEnabled, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const landingPage = await loadLanding(client, locale);
  return <LandingView landingPage={landingPage} />;
};
