import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const redis = Redis.fromEnv();

const KEY = "fireworks:count";

export async function GET() {
  try {
    const count = (await redis.get<number>(KEY)) ?? 0;

    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/v1/fireworks error:", error);

    return NextResponse.json(
      {
        count: 0,
        error: "Failed to get fireworks count",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

export async function POST() {
  try {
    const count = await redis.incr(KEY);

    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("POST /api/v1/fireworks error:", error);

    return NextResponse.json(
      {
        error: "Failed to increment fireworks",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}