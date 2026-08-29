import { Document, HeadingLevel, Paragraph, TextRun } from "docx";
import type { ExtractedLine } from "./extract";
import type { LineLabel } from "./classify";

/**
 * Susun Document docx.js dari baris + label.
 * Baris berlabel "P" yang berurutan digabung jadi SATU paragraf yang mengalir,
 * karena di PDF pemenggalan baris murni soal lebar halaman, bukan akhir kalimat.
 */
export function buildDocx(lines: ExtractedLine[], labels: LineLabel[]): Document {
  const children: Paragraph[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraphBuffer = () => {
    if (paragraphBuffer.length > 0) {
      children.push(
        new Paragraph({ children: [new TextRun(paragraphBuffer.join(" "))] })
      );
      paragraphBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const label = labels[i];
    const text = lines[i].text;

    if (label === "P") {
      paragraphBuffer.push(text);
      continue;
    }

    flushParagraphBuffer();

    switch (label) {
      case "H1":
        children.push(new Paragraph({ text, heading: HeadingLevel.HEADING_1 }));
        break;
      case "H2":
        children.push(new Paragraph({ text, heading: HeadingLevel.HEADING_2 }));
        break;
      case "BULLET":
        children.push(
          new Paragraph({
            text: text.replace(/^[-•*‣]\s*|^\d+[.)]\s*/, ""),
            bullet: { level: 0 },
          })
        );
        break;
    }
  }
  flushParagraphBuffer();

  if (children.length === 0) {
    children.push(
      new Paragraph({ text: "Tidak ada teks yang bisa diekstrak dari file PDF ini." })
    );
  }

  return new Document({ sections: [{ children }] });
}