// --- File: app/api/chat/route.ts ---
// Backend sekarang jauh lebih simpel, hanya memanggil Gemini.

import { NextResponse } from "next/server";
import { askGemini } from "@/utils/gemini"; // <-- Impor fungsi baru

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json(
        { answer: "Pertanyaan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Langsung tanya ke Gemini, yang sudah punya semua logika di dalamnya
    const answer = await askGemini(question);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error di route.ts:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan tidak diketahui.";
    return NextResponse.json(
      { answer: `Oops, ada masalah di server: ${errorMessage}` },
      { status: 500 }
    );
  }
}
