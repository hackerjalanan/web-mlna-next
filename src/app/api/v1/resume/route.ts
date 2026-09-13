import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const allowedHost = "ade-maulana.myid"; // domain production kamu, tanpa https:// dan tanpa trailing slash

  if (!isDev) {
    const referer = req.headers.get("referer") || "";

    let refererHost = "";
    try {
      refererHost = new URL(referer).hostname;
    } catch {
      refererHost = "";
    }

    if (refererHost !== allowedHost) {
      console.error(
        `Referer ditolak. Diterima: "${referer}" (host: "${refererHost}"), diharapkan: "${allowedHost}"`
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const fileUrl = new URL(
      "/portofl/CV_Ade_Maulana_Hidayah_Programer-engl.pdf",
      req.url
    );
    const fileRes = await fetch(fileUrl);

    if (!fileRes.ok) {
      throw new Error(`Gagal fetch file: ${fileRes.status}`);
    }

    const fileBuffer = await fileRes.arrayBuffer();

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