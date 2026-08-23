import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuraKata - Bicara jadi warna, teks jadi rasa",
  description: "Menghubungkan Teman Tuli dan Orang Dengar melalui visualisasi suara yang ekspresif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
