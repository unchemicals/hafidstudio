// File: src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hafid | Personal Website",
  description:
    "Personal website for Hafid, a student exploring AI, LLMs, and modern web technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tambahkan tag <head> jika belum ada */}
      <head>
        {/* === TAMBAHKAN KODE DI BAWAH INI === */}
        <link
          rel="icon"
          href="/hafid-in-suit.png"
          type="image/png"
          sizes="any"
        />
        <link rel="shortcut icon" href="/hafid-in-suit.png" type="image/png" />
        <link rel="apple-touch-icon" href="/hafid-in-suit.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
