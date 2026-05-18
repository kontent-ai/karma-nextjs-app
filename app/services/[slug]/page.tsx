import { draftMode } from "next/headers";
import { ServiceDetail } from "@/components/screens/ServiceDetail.tsx";
import { ServiceDetailPreview } from "@/components/screens/ServiceDetailPreview.tsx";
import { getDefaultEnv } from "@/lib/env/defaultEnv.ts";
import type { Service } from "@/model/index.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

export const dynamicParams = true;
export const revalidate = 300;

export const generateStaticParams = async () => {
  const envId = process.env.KONTENT_ENVIRONMENT_ID;
  const apiKey = process.env.KONTENT_DELIVERY_API_KEY;
  if (!envId || !apiKey) {
    return [];
  }
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled: false });
  const res = await client.items<Service>().type("service").toPromise();
  return res.data.items.map((item) => ({ slug: item.elements.url_slug.value }));
};

type Props = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { envId, apiKey } = getDefaultEnv();
  const { isEnabled } = await draftMode();
  return isEnabled ? (
    <ServiceDetailPreview envId={envId} slug={slug} />
  ) : (
    <ServiceDetail envId={envId} apiKey={apiKey} isPreviewEnabled={false} slug={slug} />
  );
}
