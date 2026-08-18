/**
 * Mengubah URL gambar Google (lh3.googleusercontent.com) menjadi versi
 * thumbnail dengan meminta ukuran lebih kecil langsung dari server Google,
 * supaya tidak perlu download gambar full resolution untuk grid/thumbnail.
 *
 * Referensi: lh3.googleusercontent.com mendukung suffix "=w{width}" atau
 * "=w{width}-h{height}-c" (c = crop) untuk resize on-the-fly.
 *
 * Untuk URL selain lh3 (misal sudah gambar lokal di /public), fungsi ini
 * mengembalikan URL apa adanya tanpa modifikasi.
 */
export function getThumbnailUrl(
  url: string,
  width: number = 400
): string {
  if (!url.includes("googleusercontent.com")) {
    return url;
  }

  const baseUrl = url.split("=")[0];

  return `${baseUrl}=w${width}`;
}