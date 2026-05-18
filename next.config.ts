import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets-us-01.kc-usercontent.com" },
      { protocol: "https", hostname: "assets-eu-01.kc-usercontent.com" },
      { protocol: "https", hostname: "preview-assets-us-01.kc-usercontent.com" },
      { protocol: "https", hostname: "preview-assets-eu-01.kc-usercontent.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
