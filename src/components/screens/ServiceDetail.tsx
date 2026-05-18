import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/screens/ServiceDetailView.tsx";
import { loadServiceDetail } from "@/lib/screens/serviceDetail.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Props = Readonly<{
  envId: string;
  apiKey: string;
  isPreviewEnabled: boolean;
  slug: string;
}>;

export const ServiceDetail = async ({ envId, apiKey, isPreviewEnabled, slug }: Props) => {
  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled });
  const service = await loadServiceDetail(client, slug);
  if (!service) {
    notFound();
  }
  return <ServiceDetailView service={service} />;
};
