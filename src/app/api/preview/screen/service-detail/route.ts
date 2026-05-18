import { type NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing.ts";
import { withPreviewClient } from "@/lib/preview/previewClient.ts";
import { loadServiceDetail } from "@/lib/screens/serviceDetail.ts";

export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return new NextResponse("slug required", { status: 400 });
  }
  const raw = req.nextUrl.searchParams.get("locale") ?? routing.defaultLocale;
  if (!hasLocale(routing.locales, raw)) {
    return new NextResponse("invalid locale", { status: 400 });
  }
  return await withPreviewClient(
    req,
    async ({ client }) => await loadServiceDetail(client, slug, raw),
  );
};
