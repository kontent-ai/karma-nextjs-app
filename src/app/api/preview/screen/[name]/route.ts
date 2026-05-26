import type { IDeliveryClient } from "@kontent-ai/delivery-sdk";
import { type NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { routing, type SupportedLanguage } from "@/i18n/routing.ts";
import { withPreviewClient } from "@/lib/preview/withPreviewClient.server.ts";
import { loadBlogDetail } from "@/lib/screens/blogDetail.ts";
import { loadLanding } from "@/lib/screens/landing.ts";
import { loadResearchDetail } from "@/lib/screens/researchDetail.ts";
import { loadServiceDetail } from "@/lib/screens/serviceDetail.ts";
import { loadTeamMember } from "@/lib/screens/teamMember.ts";

type ScreenConfig =
  | {
      readonly paramKey?: undefined;
      readonly load: (client: IDeliveryClient, locale: SupportedLanguage) => Promise<unknown>;
    }
  | {
      readonly paramKey: "slug" | "codename";
      readonly load: (
        client: IDeliveryClient,
        locale: SupportedLanguage,
        param: string,
      ) => Promise<unknown>;
    };

const screens: Readonly<Record<string, ScreenConfig>> = {
  landing: { load: async (client, locale) => await loadLanding(client, locale) },
  "blog-detail": {
    paramKey: "slug",
    load: async (client, locale, slug) => await loadBlogDetail(client, slug, locale),
  },
  "research-detail": {
    paramKey: "slug",
    load: async (client, locale, slug) => await loadResearchDetail(client, slug, locale),
  },
  "service-detail": {
    paramKey: "slug",
    load: async (client, locale, slug) => await loadServiceDetail(client, slug, locale),
  },
  "team-member": {
    paramKey: "codename",
    load: async (client, locale, codename) => await loadTeamMember(client, codename, locale),
  },
};

type RouteContext = Readonly<{ params: Promise<{ name: string }> }>;

export const GET = async (req: NextRequest, ctx: RouteContext) => {
  const { name } = await ctx.params;
  const screen = screens[name];
  if (!screen) {
    return new NextResponse("unknown screen", { status: 404 });
  }

  const rawLocale = req.nextUrl.searchParams.get("locale") ?? routing.defaultLocale;
  if (!hasLocale(routing.locales, rawLocale)) {
    return new NextResponse("invalid locale", { status: 400 });
  }
  const locale: SupportedLanguage = rawLocale;

  if (screen.paramKey) {
    const param = req.nextUrl.searchParams.get(screen.paramKey);
    if (!param) {
      return new NextResponse(`${screen.paramKey} required`, { status: 400 });
    }
    return await withPreviewClient(
      req,
      async ({ client }) => await screen.load(client, locale, param),
    );
  }

  return await withPreviewClient(req, async ({ client }) => await screen.load(client, locale));
};
