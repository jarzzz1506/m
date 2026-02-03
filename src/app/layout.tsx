import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MothGuard London | Professional Moth Treatment & Prevention",
  description:
    "London's leading moth treatment specialists. Expert carpet moth, clothes moth & pantry moth removal. BPCA certified. Same-day service available across all London boroughs.",
  keywords:
    "moth treatment London, moth pest control, carpet moth removal, clothes moth treatment, moth fumigation, moth prevention London",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
