// --- File: src/app/layout.tsx ---
// Perbaikan utama untuk scrolling di mobile.

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Metadata diperbarui agar lebih profesional
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
    // Menggunakan bahasa "id" untuk SEO yang lebih baik
    <html lang="id">
      {/* FIX: className dihapus dari body. 
        Ini mengizinkan konten untuk menentukan tinggi halaman 
        dan mencegah footer terpotong di layar mobile.
      */}
      <body>{children}</body>
    </html>
  );
}
