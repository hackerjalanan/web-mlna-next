import { Packer } from "docx";
import { apiHandler } from "@/lib/api/handler";
import { http } from "@/lib/api/http";
import { extractLines, getMedianFontSize } from "@/lib/pdf-to-docx/extract";
import { classifyLines } from "@/lib/pdf-to-docx/classify";
import { buildDocx } from "@/lib/pdf-to-docx/build-docx";

export const runtime = "nodejs";

export const POST = apiHandler(async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw http.badRequest("File tidak ditemukan", "FILE_REQUIRED");
  }

  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    throw http.badRequest("File harus berupa PDF", "INVALID_FILE_TYPE");
  }

  const pdfBuffer = Buffer.from(await file.arrayBuffer());

  // 1. Ekstraksi teks + ukuran font — gratis, tanpa AI
  const lines = await extractLines(pdfBuffer);
  const medianFontSize = getMedianFontSize(lines);

  // 2. Klasifikasi struktur — AI hanya balikin label singkat per baris (hemat token)
  const labels = await classifyLines(lines, medianFontSize);

  // 3. Susun DOCX dari label — logika biasa, tanpa AI
  const doc = buildDocx(lines, labels);
  const docxBuffer = await Packer.toBuffer(doc);

  const fileName = file.name.replace(/\.pdf$/i, "") || "converted";

  return new Response(new Uint8Array(docxBuffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${fileName}.docx"`,
    },
  });
});