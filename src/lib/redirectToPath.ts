import { NextResponse } from "next/server";

export const redirectToPath = (path: string): NextResponse =>
  new NextResponse(null, { status: 307, headers: { Location: path } });
