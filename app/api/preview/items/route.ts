import type { NextRequest } from "next/server";
import { withPreviewClient } from "@/lib/preview/previewClient.ts";

export const GET = async (req: NextRequest) =>
  await withPreviewClient(req, async ({ client, searchParams }) => {
    const codenames = (searchParams.get("codenames") ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (codenames.length === 0) {
      return [];
    }
    const res = await client.items().inFilter("system.codename", codenames).toPromise();
    return res.data.items;
  });
