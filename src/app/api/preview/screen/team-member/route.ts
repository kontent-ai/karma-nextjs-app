import { type NextRequest, NextResponse } from "next/server";
import { withPreviewClient } from "@/lib/preview/previewClient.ts";
import { loadTeamMember } from "@/lib/screens/teamMember.ts";

export const GET = async (req: NextRequest) => {
  const codename = req.nextUrl.searchParams.get("codename");
  if (!codename) {
    return new NextResponse("codename required", { status: 400 });
  }
  return await withPreviewClient(req, async ({ client }) => await loadTeamMember(client, codename));
};
