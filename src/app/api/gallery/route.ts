import { NextRequest, NextResponse } from "next/server";
import { getGalleryItems } from "@/service/gallery.service";
import type { SortOrder } from "@/types/gallery";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const sortOrder = (searchParams.get("sortOrder") as SortOrder) || "newest";

  try {
    const items = await getGalleryItems({ search, category, sortOrder });

    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}