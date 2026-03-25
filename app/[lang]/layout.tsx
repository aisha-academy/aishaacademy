import React from "react";
import type { Metadata } from "next";
import {
  Playfair_Display,
  Inter,
  Amiri,
  Scheherazade_New,
  Lateef,
  Noto_Naskh_Arabic,
  Poppins,
} from "next/font/google";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import "../globals.css";
import WhatsappButton from "@/components/ui/whatsapp-button";
import WhatsappGroupButton from "@/components/ui/whatsapp-group-button";
import Script from "next/script";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const lateef = Lateef({
  variable: "--font-lateef",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const notoNaskh = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"], // Poppins supports Latin
  weight: ["400", "600", "700"],
});

export const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return {
    metadataBase: new URL("https://aisha-academy.com"),
    title: {
      default: isEn
        ? "Aisha Academy | Leading Quran & Islamic Institute in Montreal"
        : "Aisha Academy | Institut Coranique et Islamique de Premier Plan à Montréal",
      template: "%s | Aisha Academy",
    },
    description: isEn
      ? "Trusted Quran education for children in Montreal and worldwide. Online and physical classes focusing on Tilawah, Tajweed, and character building (Tarbiyah)."
      : "Éducation coranique de confiance pour les enfants à Montréal et dans le monde entier. Cours en ligne et en présentiel axés sur la Tilawah, le Tajweed et la formation du caractère (Tarbiyah).",
    keywords: [
      "Quran classes Montreal",
      "Islamic school Montreal",
      "Online Quran Academy",
      "Tajweed for children",
      "Islamic education Montreal",
      "Aisha Academy",
      "Quran hifz Montreal",
      "Arabic classes for kids",
    ],
    authors: [{ name: "Aisha Academy" }],
    creator: "Aisha Academy",
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "fr_CA",
      url: "https://aisha-academy.com",
      title: isEn
        ? "Aisha Academy | Leading Quran & Islamic Institute in Montreal"
        : "Aisha Academy | Institut Coranique et Islamique de Premier Plan à Montréal",
      description: isEn
        ? "Expert Quran and Islamic studies for kids. Nurturing young hearts with the light of the Quran since 2015."
        : "Études coraniques et islamiques expertes pour les enfants. Nourrir les jeunes cœurs avec la lumière du Coran depuis 2015.",
      siteName: "Aisha Academy",
      images: [
        {
          url: "/images/img3.jpg",
          width: 1200,
          height: 630,
          alt: "Aisha Academy Students",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aisha Academy | Young Hearts with the Quran",
      description: isEn
        ? "Trusted Quran education for children. Online and physical classes available."
        : "Éducation coranique de confiance pour les enfants. Cours en ligne et en présentiel disponibles.",
      images: ["/images/img3.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "tuAS_SdU7pnZuwUBr0LQwfqP7Et_c_cVf39FkR8a0lo",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { getDictionary } = await import("@/lib/dictionary");
  const dict = await getDictionary(lang as any);

  return (
    <html
      lang={lang || "fr"}
      className={`${notoNastaliq.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-site-verification" content="AE2s4AgJTX7lAEZn6Cu9bWGr7VniZFCMO11qAkDjuXg" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9283Z62J9W"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-9283Z62J9W');
          `}
        </Script>
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${amiri.variable} ${scheherazade.variable} ${lateef.variable} ${notoNaskh.variable} ${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent focus:text-primary focus:font-bold focus:rounded-xl focus:shadow-2xl"
        >
          Skip to content
        </a>
        {children}
        <WhatsappButton
          message={dict.contact.form.whatsappButtonMessage}
          tooltip={dict.navigation.contact}
        />
        <WhatsappGroupButton tooltip={dict.navigation.joinGroup} />
        <Toaster position="top-center" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
