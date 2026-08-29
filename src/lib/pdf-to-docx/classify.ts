import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import type { ExtractedLine } from "./extract";

export type LineLabel = "H1" | "H2" | "P" | "BULLET";

const VALID_LABELS: LineLabel[] = ["H1", "H2", "P", "BULLET"];

// Jumlah baris per panggilan AI — dijaga kecil supaya prompt tetap ringkas
// dan satu chunk yang gagal tidak merusak seluruh dokumen.
const CHUNK_SIZE = 60;

/**
 * Klasifikasi heuristik (tanpa AI, gratis) — dipakai sebagai fallback
 * kalau panggilan AI gagal, dan juga sebagai hint yang dikirim ke AI.
 */
function heuristicLabel(line: ExtractedLine, medianFontSize: number): LineLabel {
  const ratio = line.fontSize / medianFontSize;
  if (/^[-•*‣]\s/.test(line.text) || /^\d+[.)]\s/.test(line.text)) return "BULLET";
  if (ratio >= 1.4) return "H1";
  if (ratio >= 1.15) return "H2";
  return "P";
}

/**
 * Minta AI mengklasifikasikan setiap baris. AI HANYA membalas label singkat
 * per baris (bukan menulis ulang isi), jadi output token sangat kecil
 * dibanding kalau AI diminta menyusun ulang seluruh teks.
 */
async function classifyChunk(
  lines: ExtractedLine[],
  medianFontSize: number
): Promise<LineLabel[]> {
  const fallback = lines.map((l) => heuristicLabel(l, medianFontSize));

  // Baris kosong/dokumen sangat pendek — tidak perlu panggil AI sama sekali
  if (lines.length === 0) return fallback;

  const numberedLines = lines
    .map((l, i) => {
      const ratio = (l.fontSize / medianFontSize).toFixed(2);
      const text = l.text.length > 200 ? l.text.slice(0, 200) + "…" : l.text;
      return `${i + 1}: "${text}" | rasio_font=${ratio}`;
    })
    .join("\n");

  const prompt = `Kamu mengklasifikasikan struktur baris teks hasil ekstraksi PDF.

Label yang valid (pilih salah satu per baris):
- H1 = judul utama/besar
- H2 = sub judul
- BULLET = poin daftar (list item)
- P = paragraf/teks biasa

Petunjuk: "rasio_font" adalah ukuran font baris dibagi ukuran font body text. Rasio > 1 berarti lebih besar dari teks biasa (kandidat heading).

Balas HANYA dengan array JSON berisi ${lines.length} label, urut sesuai nomor baris. Tanpa penjelasan, tanpa markdown, tanpa teks lain.
Contoh format balasan: ["H1","P","P","H2","BULLET"]

Baris:
${numberedLines}`;

  try {
    const result = await generateText({
      model: groq("openai/gpt-oss-120b"),
      prompt,
    });

    const cleaned = result.text.trim().replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed) || parsed.length !== lines.length) {
      return fallback;
    }

    return parsed.map((label: unknown, i: number) =>
      VALID_LABELS.includes(label as LineLabel) ? (label as LineLabel) : fallback[i]
    );
  } catch {
    // AI gagal / respons tidak valid → tetap jalan pakai hasil heuristik
    return fallback;
  }
}

/**
 * Klasifikasikan seluruh baris dokumen, diproses per chunk supaya
 * prompt tetap ringkas dan chunk yang gagal tidak merusak seluruhnya.
 */
export async function classifyLines(
  lines: ExtractedLine[],
  medianFontSize: number
): Promise<LineLabel[]> {
  const labels: LineLabel[] = [];

  for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
    const chunk = lines.slice(i, i + CHUNK_SIZE);
    const chunkLabels = await classifyChunk(chunk, medianFontSize);
    labels.push(...chunkLabels);
  }

  return labels;
}   