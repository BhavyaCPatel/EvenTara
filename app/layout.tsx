import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: '--font-nunito' 
});

export const metadata: Metadata = {
  title: "EvenTara",
  description: "Event management platform.",
  icons: {
    icon:'/assets/images/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={nunito.variable}>{children}</body>
        <SpeedInsights />
        <Analytics />
      </html>
    </ClerkProvider>
  );
}
