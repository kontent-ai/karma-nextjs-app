import { notFound } from "next/navigation";
import { TeamMemberView } from "@/components/screens/TeamMemberView.tsx";
import { loadTeamMember } from "@/lib/screens/teamMember.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
}>;

export const TeamMember = async ({ envId, apiKey, isPreviewEnabled, slug }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const person = await loadTeamMember(client, slug);
  if (!person) {
    notFound();
  }
  return <TeamMemberView person={person} />;
};
