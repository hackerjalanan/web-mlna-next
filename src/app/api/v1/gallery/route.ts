import { http } from "@/lib/api/http";
import { json } from "@/lib/api/json";
import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { getGoogleDriveThumbnailUrl } from "@/lib/GoogleDrive";
import { getGalleryItems } from "@/service/gallery.service";
import type { SortOrder, GalleryCategory } from "@/types/gallery";

const ALLOWED_CATEGORIES: GalleryCategory[] = [
  "Photography",
  "Design",
  "Project",
  "Activity",
];

const ALLOWED_SORT_ORDERS: SortOrder[] = ["newest", "oldest"];

function validateCategory(
  category: string | undefined
): GalleryCategory | undefined {
  if (!category || category === "All") return undefined;

  if (!ALLOWED_CATEGORIES.includes(category as GalleryCategory)) {
    throw http.badRequest(
      `Category harus salah satu dari: All, ${ALLOWED_CATEGORIES.join(", ")}`,
      "INVALID_CATEGORY"
    );
  }

  return category as GalleryCategory;
}

function validateSortOrder(sortOrder: string | undefined): SortOrder {
  if (!sortOrder) return "newest";

  if (!ALLOWED_SORT_ORDERS.includes(sortOrder as SortOrder)) {
    throw http.badRequest(
      `sortOrder harus salah satu dari: ${ALLOWED_SORT_ORDERS.join(", ")}`,
      "INVALID_SORT_ORDER"
    );
  }

  return sortOrder as SortOrder;
}

// GET /api/v1/gallery?search=&category=&sortOrder=
export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim() || undefined;
  const category = validateCategory(searchParams.get("category") ?? undefined);
  const sortOrder = validateSortOrder(searchParams.get("sortOrder") ?? undefined);

  const items = await getGalleryItems({ search, category, sortOrder });

  const gallery = items.map((item) => ({
    ...item,
    image: getGoogleDriveThumbnailUrl(item.image),
  }));

  return success(gallery, "Data gallery berhasil diambil");
});

interface GalleryFilterBody {
  search?: string;
  category?: "All" | GalleryCategory;
  sortOrder?: SortOrder;
}

// POST /api/v1/gallery  { search, category, sortOrder }
export const POST = apiHandler(async (request) => {
  const body = await json<GalleryFilterBody>(request);

  const search = body.search?.trim() || undefined;
  const category = validateCategory(body.category);
  const sortOrder = validateSortOrder(body.sortOrder);

  const items = await getGalleryItems({ search, category, sortOrder });

  const gallery = items.map((item) => ({
    ...item,
    image: getGoogleDriveThumbnailUrl(item.image),
  }));

  return success(gallery, "Data gallery berhasil difilter");
});