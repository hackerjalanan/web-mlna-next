import { fileURLToPath } from "node:url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Worker di-set ke file lokal supaya tidak kena masalah bundling Next.js/Turbopack
// (lihat next.config.ts: pdfjs-dist harus masuk `serverExternalPackages`)
pdfjsLib.GlobalWorkerOptions.workerSrc = fileURLToPath(
  new URL(
    "../../../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
  )
);

export type ExtractedLine = {
  text: string;
  fontSize: number;
  page: number;
};

/**
 * Ekstrak teks dari PDF, dikelompokkan per baris berdasarkan posisi Y,
 * beserta ukuran font tiap baris. Tidak memakai AI sama sekali — gratis.
 */
export async function extractLines(pdfBuffer: Buffer): Promise<ExtractedLine[]> {
  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer),
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  const lines: ExtractedLine[] = [];
  const Y_TOLERANCE = 2;

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();

    let current: ExtractedLine & { y: number } | null = null;

    for (const item of textContent.items) {
      if (!("str" in item) || item.str.trim() === "") continue;

      const fontSize = Math.hypot(item.transform[2], item.transform[3]);
      const y = item.transform[5];

      if (current && Math.abs(current.y - y) <= Y_TOLERANCE) {
        current.text += item.str;
        current.fontSize = Math.max(current.fontSize, fontSize);
      } else {
        if (current) lines.push(current);
        current = { text: item.str, y, fontSize, page: pageNum };
      }
    }
    if (current) lines.push(current);

    await page.cleanup();
  }

  return lines
    .map(({ text, fontSize, page }) => ({ text: text.trim(), fontSize, page }))
    .filter((l) => l.text.length > 0);
}

/** Ukuran font "body text" — nilai tengah (median) dari semua baris. */
export function getMedianFontSize(lines: ExtractedLine[]): number {
  if (lines.length === 0) return 12;
  const sizes = [...lines.map((l) => l.fontSize)].sort((a, b) => a - b);
  return sizes[Math.floor(sizes.length / 2)];
}