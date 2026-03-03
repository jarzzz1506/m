import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "PropertyPulse | Dubai Property Price Monitor",
  description:
    "Track property price changes and trends from propertyfinder.ae. Monitor Dubai real estate prices, analyze market trends, and spot opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
