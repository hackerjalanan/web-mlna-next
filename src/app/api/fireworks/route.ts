import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv(); // otomatis baca env var dari Vercel

const KEY = "fireworks:count";

export async function GET() {
  const count = (await redis.get<number>(KEY)) ?? 0;
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await redis.incr(KEY);
  return NextResponse.json({ count });
}

// import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({
//     success: true,
//     count: 123,
//     message: "API fireworks berhasil",
//   });
// }