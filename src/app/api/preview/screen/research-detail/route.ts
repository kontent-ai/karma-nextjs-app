import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/lib/i18n.ts";
import { withPreviewClient } from "@/lib/preview/previewClient.ts";
import { loadResearchDetail } from "@/lib/screens/researchDetail.ts";

export const GET = async (req: NextRequest) => {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return new NextResponse("slug required", { status: 400 });
  }
  const lang = (req.nextUrl.searchParams.get("lang") ?? DEFAULT_LANGUAGE) as SupportedLanguage;
  return await withPreviewClient(
    req,
    async ({ client }) => await loadResearchDetail(client, slug, lang),
  );
};
