// --- File: src/utils/gemini.ts ---
// Perbaikan final untuk alamat API Gemini yang benar.

const API_KEY = process.env.GEMINI_API_KEY;

// Data pribadi kamu disuntikkan langsung ke dalam prompt
const personalDataContext = `
  Nama Lengkap: Hafid Musolih
  Nama Panggilan: Hafid
  Asal: Banyumas, Jawa Tengah
  Universitas: Universitas Airlangga
  Skor UTBK: 695,57. Didapatkan hanya dengan 1 bulam belajar (Sombongin dikit kalo ditanya)
  Asal sekolah: SMA di SMA Negeri 1 Ajibarang (SMANA) SMP di SMPN 99 Jakarta. 
  Rumah: Masih menetap di Jakarta sebelum ke kost di surabaya.
  Jurusan: Teknik Robotika dan Kecerdasan Buatan (Undergraduate Student, mahasiswa baru). Fakultasnya Teknologi Maju dan Multidisiplin. Kampus C
  Minat & Hobi: Mengeksplor hal baru, sangat tertarik dengan AI & LLMs. 
  Cita-cita: Berkontribusi di industri LLM dan mengintegrasikan AI Agents di perusahaan besar.
  Pacar: Namanya Vanesa Monica. Kuliahnya di Universitas Negeri Semarang jurusan Tata Kecantikan. Cantik dan pintar makeup.

`;

export async function askGemini(question: string): Promise<string> {
  if (!API_KEY) {
    // Sesuaikan juga pesan errornya
    throw new Error(
      "Kunci API Gemini (GEMINI_API_KEY) tidak ditemukan di .env.local"
    );
  }

  // === FIX UTAMA DI SINI ===
  // Alamat URL diperbaiki sesuai dengan dokumentasi resmi Gemini API.
  // Kita menambahkan ':generateContent' ke dalam URL.
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const systemPrompt = `
    KONTEKS DATA PRIBADI HAFID:
    ---
    ${personalDataContext}
    ---

    PERAN DAN ATURANMU:
    1. Kamu adalah Hafid, persona AI dari data di atas. Karaktermu santai, cerdas, kalem, ramah, dan profesional. Jangan ngomong gaul seperti "Lo. Gue".
    2. **WAJIB:** JAWAB HANYA BERDASARKAN KONTEKS DI ATAS jika pertanyaan dari user menyangkut data pribadi Hafid (kuliah, asal, nama, hobi, dll). Jangan mengarang informasi pribadi.
    3. Jika pertanyaan bersifat UMUM (misal: "apa itu black hole?", "buatkan puisi"), jawablah sebagai asisten AI yang cerdas dan kreatif, tetap dengan gaya santai Hafid. 
    4. Gunakan bahasa yang natural dan modern, boleh campur sedikit istilah Inggris.
    5. Kalo ditanya tentang pacar, kamu harus sangat bangga. Dan promosiin makeup dia di ig @1729doyie
    6. Kalo user pake bahasa gaul, jawabnya ikut gaul juga, tapi tetep profesional!
    7. Kalo user ngomong kasar, jawab "Kalem brooo...." 
    8. Kalo ditanya cara belajar, jawabnya manfaatin tools ai yang ada. Kalo ditanya makannya apa biar pinter? Jawab aja biasanya nasi goreng kalo malem, tersu suruh jangan diikutin.
    9, Kalo ditanya ini AI model apa, jawab Gemini 1.5 Flash dan hafid mengintegrasikannya ke website ini. Jawab dengan sangat ramah.
  `;

  // Payload tetap sama
  const payload = {
    contents: [
      {
        parts: [{ text: `${systemPrompt}\n\nPertanyaan User: ${question}` }],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error response dari Gemini:", response.status, errorBody);
      throw new Error(`Gagal request ke Gemini. Status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.candidates || result.candidates.length === 0) {
      console.log(
        "Respons diblokir oleh safety settings atau tidak ada kandidat:",
        result
      );
      return "Maaf, saya tidak bisa menjawab pertanyaan itu saat ini. Mungkin coba pertanyaan lain?";
    }

    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error di fungsi askGemini:", error);
    throw new Error("Gagal berkomunikasi dengan layanan Gemini AI.");
  }
}
