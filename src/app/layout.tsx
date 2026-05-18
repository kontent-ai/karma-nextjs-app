import type { Metadata } from "next";
import { Abhaya_Libre, Source_Sans_3 } from "next/font/google";
import { draftMode } from "next/headers";
import { type ReactNode, Suspense } from "react";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import { SmartLinkProvider } from "@/components/SmartLinkProvider.tsx";
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
  title: "Kontent.ai Karma Health Sample",
  description:
    "Next.js sample app for the Karma Health site, showcasing the Kontent.ai Delivery SDK, Draft Mode preview, and Smart Link in-context editing.",
  icons: {
    icon: "/kaipurple.png",
  },
};

const Shell = ({ children }: Readonly<{ children: ReactNode }>) => (
  <div className="flex flex-col min-h-screen">
    <Suspense>
      <Header />
    </Suspense>
    <div className="flex flex-col flex-1">{children}</div>
    <Footer />
  </div>
);

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { isEnabled } = await draftMode();
  return (
    <html lang="en" className={`${sourceSans.variable} ${abhayaLibre.variable}`}>
      <body>
        {isEnabled ? (
          <SmartLinkProvider>
            <Shell>{children}</Shell>
          </SmartLinkProvider>
        ) : (
          <Shell>{children}</Shell>
        )}
      </body>
    </html>
  );
}
