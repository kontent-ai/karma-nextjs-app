import { notFound } from "next/navigation";
import { NotTranslated } from "@/components/screens/NotTranslated.tsx";
import { TeamMemberView } from "@/components/screens/TeamMemberView.tsx";
import type { SupportedLanguage } from "@/i18n/routing.ts";
import { loadTeamMember } from "@/lib/screens/teamMember.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
  locale: SupportedLanguage;
}>;

export const TeamMember = async ({ envId, apiKey, isPreviewEnabled, slug, locale }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const result = await loadTeamMember(client, slug, locale);
  if (result.kind === "notFound") {
    notFound();
  }
  if (result.kind === "notTranslated") {
    return <NotTranslated locale={locale} />;
  }
  return <TeamMemberView person={result.item} />;
};
