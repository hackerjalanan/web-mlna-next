// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { name, message, token } = await req.json();

//   const verifyRes = await fetch(
//     "https://challenges.cloudflare.com/turnstile/v0/siteverify",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         secret: process.env.TURNSTILE_SECRET_KEY,
//         response: token,
//       }),
//     }
//   );

//   const verifyData = await verifyRes.json();

//   if (!verifyData.success) {
//     return NextResponse.json({ error: "Verifikasi gagal, terindikasi bot." }, { status: 400 });
//   }

//   // Token valid — lanjut proses form (simpan ke DB, kirim email, dll)
//   return NextResponse.json({ success: true });
// }