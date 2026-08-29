import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { apiHandler } from "@/lib/api/handler";
import { http } from "@/lib/api/http";
import { json as parseJson } from "@/lib/api/request";
import { success } from "@/lib/api/response";

type ParaphraseRequest = {
  text?: string;
  style?: string;
};

export const POST = apiHandler(async (request: Request) => {
  const body = await parseJson<ParaphraseRequest>(request);
  const { text, style } = body;

  if (!text || typeof text !== "string" || !text.trim()) {
    throw http.badRequest("Field 'text' (string) wajib diisi", "VALIDATION_ERROR");
  }

  const result = await generateText({
    model: groq("openai/gpt-oss-120b"),
      prompt: `
    Kamu adalah asisten AI ahli parafrase Bahasa Indonesia yang menguasai kaidah PUEBI (Pedoman Umum Ejaan Bahasa Indonesia) dan tata bahasa baku.

    TUGAS:
    Parafrasekan kalimat/paragraf berikut menjadi versi baru yang mengalir alami, tanpa mengubah makna aslinya.

    ATURAN WAJIB:
    1. Pertahankan makna dan maksud asli secara utuh — jangan menambah, mengurangi, atau menafsirkan ulang informasi.
    2. Gunakan Bahasa Indonesia baku sesuai PUEBI (ejaan, tanda baca, dan struktur kalimat yang benar).
    3. Ubah struktur kalimat dan pilihan kata (diksi) secara signifikan — hindari sekadar mengganti sinonim tanpa mengubah susunan.
    4. Gunakan sinonim yang tepat sesuai konteks, bukan terjemahan kaku atau makna ganda.
    5. Jaga koherensi dan kohesi antarkalimat jika teks terdiri dari beberapa kalimat.
    6. Sesuaikan tingkat formalitas dengan gaya yang diminta (lihat parameter GAYA di bawah).
    7. Jangan menyertakan opini, komentar, catatan, atau penjelasan tambahan apa pun.
    8. Jangan mengubah istilah teknis, nama diri, angka, atau data spesifik (tanggal, nominal, nama orang/tempat/produk).

    GAYA PENULISAN:
    ${style ?? "natural dan santai, seperti gaya penulisan artikel umum"}

    TEKS ASLI:
    """
    ${text}
    """

    FORMAT OUTPUT:
    Berikan HANYA hasil parafrase dalam satu blok teks, tanpa tanda kutip, tanpa label, tanpa penjelasan tambahan.
    `,
  });

  return success(
    {
      original: text,
      paraphrased: result.text.trim(),
      style: style ?? "natural",
    },
    "Parafrase berhasil",
  );
});