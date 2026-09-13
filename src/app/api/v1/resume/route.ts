import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const referer = req.headers.get("referer") || "";
  const allowedHost = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    if (!allowedHost) {
      console.error(
        "NEXT_PUBLIC_SITE_URL belum diset di environment variables"
      );
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (!referer.includes(allowedHost)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    // Ambil file langsung dari static asset public/, bukan dari disk server
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