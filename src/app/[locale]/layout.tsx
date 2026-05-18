import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import { routing } from "@/i18n/routing.ts";

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <NextIntlClientProvider>
      <div className="flex flex-col min-h-screen">
        <Suspense>
          <Header />
        </Suspense>
        <div className="flex flex-col flex-1">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
