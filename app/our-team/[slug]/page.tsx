import { TeamMember } from "@/components/screens/TeamMember.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";
import type { Person } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const envId = process.env.KONTENT_ENVIRONMENT_ID;
  const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
  if (!envId || !apiKey) {
    return [];
  }
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled: false });
  const res = await client.items<Person>().type("person").toPromise();
  return res.data.items.map((item) => ({ slug: item.system.codename }));
};

type Props = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { envId, apiKey } = getDefaultEnv();
  return <TeamMember envId={envId} apiKey={apiKey} isPreviewEnabled={false} slug={slug} />;
}
