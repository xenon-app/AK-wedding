
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akhilesh & Rakhi | Wedding Invitation",
  description:
    "With the blessings of our families, we warmly invite you to celebrate the wedding of Akhilesh Kumar & Kumari Rakhi on 9th December 2026. Join us for our special celebrations, cherished moments, and a beautiful beginning together.",

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    title: "Akhilesh & Rakhi | Wedding Invitation",
    description:
      "A special invitation to celebrate the wedding of Akhilesh Kumar & Kumari Rakhi on 9th December 2026.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Akhilesh & Rakhi Wedding Invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Akhilesh & Rakhi | Wedding Invitation",
    description:
      "Join us in celebrating the wedding of Akhilesh Kumar & Kumari Rakhi.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

