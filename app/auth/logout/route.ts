import { NextResponse } from "next/server";
import { getAuth0Config } from "@/lib/auth0/config.ts";
import { buildLogoutUrl } from "@/lib/auth0/flows.ts";
import { getSession } from "@/lib/auth0/session.ts";

export async function GET() {
  const session = await getSession();
  session.destroy();
  await session.save();
  return NextResponse.redirect(await buildLogoutUrl(getAuth0Config().appBaseUrl));
}
