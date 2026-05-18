import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getDefaultEnv, isDefaultEnv } from "@/lib/env/defaultEnv.ts";
import { resolveApiKey } from "@/lib/env/resolveApiKey.ts";
import { getDeliveryClient } from "@/utils/client.server.ts";

type Handler<T> = (args: {
  client: IDeliveryClient;
  envId: string;
  searchParams: URLSearchParams;
}) => Promise<T>;

export const withPreviewClient = async <T>(
  req: NextRequest,
  handler: Handler<T>,
): Promise<NextResponse> => {
  const { isEnabled } = await draftMode();
  if (!isEnabled) {
    return new NextResponse("Draft Mode required", { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const envId = searchParams.get("envId");
  if (!envId) {
    return new NextResponse("envId required", { status: 400 });
  }

  const apiKey = isDefaultEnv(envId)
    ? getDefaultEnv().apiKey
    : await resolveApiKey(envId).catch(() => null);
  if (!apiKey) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const client = getDeliveryClient({ environmentId: envId, apiKey, isPreviewEnabled: true });
  const data = await handler({ client, envId, searchParams });
  return NextResponse.json(data);
};
