import { draftMode } from "next/headers";
import { TeamMember } from "@/components/screens/TeamMember.tsx";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";

export const dynamic = "force-dynamic";

type Props = Readonly<{
  params: Promise<{ envId: string; slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { envId, slug } = await params;
  const apiKey = await resolveApiKey(envId);
  const { isEnabled } = await draftMode();
  return <TeamMember envId={envId} apiKey={apiKey} isPreviewEnabled={isEnabled} slug={slug} />;
}
