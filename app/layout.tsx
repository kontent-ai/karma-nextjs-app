import type { Metadata } from "next";
import { Abhaya_Libre, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import { SmartLinkProvider } from "@/components/SmartLinkProvider.tsx";
import { AppContextProvider } from "@/context/AppContext.tsx";
import { getEnvContextBase } from "./_lib/getEnvContext.ts";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const abhayaLibre = Abhaya_Libre({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-libre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kontent.ai Kickstart",
  description: "Get started quickly with Kontent.ai using our Kickstart application template.",
  icons: {
    icon: "/kaipurple.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const envContext = await getEnvContextBase();

  return (
    <html lang="en" className={`${sourceSans.variable} ${abhayaLibre.variable}`}>
      <body>
        <AppContextProvider value={envContext}>
          <SmartLinkProvider environmentId={envContext.environmentId}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-col flex-1">{children}</div>
              <Footer />
            </div>
          </SmartLinkProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
