import { type NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing.ts";
import { withPreviewClient } from "@/lib/preview/previewClient.ts";
import { loadTeamMember } from "@/lib/screens/teamMember.ts";

export const GET = async (req: NextRequest) => {
  const codename = req.nextUrl.searchParams.get("codename");
  if (!codename) {
    return new NextResponse("codename required", { status: 400 });
  }
  const raw = req.nextUrl.searchParams.get("locale") ?? routing.defaultLocale;
  if (!hasLocale(routing.locales, raw)) {
    return new NextResponse("invalid locale", { status: 400 });
  }
  return await withPreviewClient(
    req,
    async ({ client }) => await loadTeamMember(client, codename, raw),
  );
};
