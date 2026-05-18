import type { NextRequest } from "next/server";
import { withPreviewClient } from "@/lib/preview/previewClient.ts";
import { loadLanding } from "@/lib/screens/landing.ts";

export const GET = async (req: NextRequest) =>
  await withPreviewClient(req, async ({ client }) => await loadLanding(client));
