import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const referer = req.headers.get("referer") || "";
  const allowedHost = "localhost:3000"; // ganti sesuai domain kamu
  const isDev = process.env.NODE_ENV === "development";

  // Lewati pengecekan referer saat development, supaya tidak keblokir di localhost
  if (!isDev && !referer.includes(allowedHost)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "portofl",
    "CV_Ade_Maulana_Hidayah_Programer-engl.pdf"
  );

  try {
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=resume.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gagal membaca file resume:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}