import { apiHandler } from "@/lib/api/handler";
import { success, failure } from "@/lib/api/response";
import { getGoogleDriveThumbnailUrl } from "@/lib/GoogleDrive";
import { getGalleryItemById } from "@/service/gallery.service";

export const GET = apiHandler(async (
  request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!id || Number.isNaN(id)) {
    return failure("ID gallery tidak valid", 400);
  }

  const item = await getGalleryItemById(id);

  if (!item) {
    return failure("Data gallery tidak ditemukan", 404);
  }

  const gallery = {
    ...item,
    image: getGoogleDriveThumbnailUrl(item.image),
  };

  return success(gallery, "Data gallery berhasil diambil");
}); 