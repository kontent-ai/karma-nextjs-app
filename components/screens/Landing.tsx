import { LandingView } from "@/components/screens/LandingView.tsx";
import { loadLanding } from "@/lib/screens/landing.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
}>;

export const Landing = async ({ envId, apiKey, isPreviewEnabled }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const landingPage = await loadLanding(client);
  return <LandingView landingPage={landingPage} />;
};
