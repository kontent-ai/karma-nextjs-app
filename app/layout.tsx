import type { Metadata } from "next";
import { Abhaya_Libre, Source_Sans_3 } from "next/font/google";
import { type ReactNode, Suspense } from "react";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${abhayaLibre.variable}`}>
      <body>
        <div className="flex flex-col min-h-screen">
          <Suspense>
            <Header />
          </Suspense>
          <div className="flex flex-col flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
