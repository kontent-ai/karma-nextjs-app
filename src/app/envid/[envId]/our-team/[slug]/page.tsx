import { draftMode } from "next/headers";
import { TeamMember } from "@/components/screens/TeamMember.tsx";
import { TeamMemberPreview } from "@/components/screens/TeamMemberPreview.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, slug } = await params;
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    return <TeamMemberPreview envId={envId} slug={slug} />;
  }
  const apiKey = await resolveApiKey(envId);
  return <TeamMember envId={envId} apiKey={apiKey} isPreviewEnabled={false} slug={slug} />;
}
