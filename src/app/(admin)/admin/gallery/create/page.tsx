"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GalleryCategory } from "@/types/gallery";
import { getGoogleDriveThumbnailUrl } from "@/lib/GoogleDrive";

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";


function extractGoogleDriveId(value: string): string | null {
  const input = value.trim();

  const fileMatch = input.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );

  if (fileMatch) {
    return fileMatch[1];
  }

  const queryMatch = input.match(
    /drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/
  );

  if (queryMatch) {
    return queryMatch[1];
  }

  if (/^[a-zA-Z0-9_-]+$/.test(input)) {
    return input;
  }

  return null;
}



export default function CreateGalleryPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "Photography" as GalleryCategory,
    date: "",
  });


  function handleImageChange(value: string) {
    setForm({ ...form, image: value });
    setImageError(false);
    setImageLoading(true);
  }
  

  function extractGoogleDriveId(value: string): string | null {
    const input = value.trim();

    // Format:
    // https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = input.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    );

    if (fileMatch) {
      return fileMatch[1];
    }

    // Format:
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    const queryMatch = input.match(
      /drive\.google\.com\/(?:open|uc)\?(?:[^#]*&)?id=([a-zA-Z0-9_-]+)/
    );

    if (queryMatch) {
      return queryMatch[1];
    }

    // Kalau user langsung memasukkan ID
    if (/^[a-zA-Z0-9_-]+$/.test(input)) {
      return input;
    }

    return null;
  }

  const driveId = extractGoogleDriveId(form.image);

  const isValidImage = !!driveId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErrorMsg(null);

    const driveId = extractGoogleDriveId(form.image);

    if (!driveId) {
      setLoading(false);
      setErrorMsg(
        "Link Google Drive tidak valid. Masukkan link Google Drive atau File ID."
      );
      return;
    }

    const { error } = await supabase.from("gallery_items").insert([
      {
        title: form.title,
        description: form.description,
        image: driveId,
        category: form.category,
        date: form.date,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      setErrorMsg(`${error.message} ${error.code ? `(${error.code})` : ""}`);
      return;
    }

    router.push("/admin/gallery");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1440px]">
      <div className="bg-slate-950/70 shadow-2xl shadow-black/30 backdrop-blur-xl p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-5">
              <div className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  Gallery Management
                </p>
                <h1 className="text-3xl font-bold text-white">
                  Tambah Gallery
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Tambahkan foto, project, atau aktivitas baru.
                </p>
              </div>

              <div>
                <label className={labelClass}>Judul</label>
                <input
                  required
                  placeholder="Contoh: Rawapening Sunset"
                  className={inputClass}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Deskripsi</label>
                <textarea
                  rows={4}
                  placeholder="Deskripsi singkat..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as GalleryCategory,
                      })
                    }
                  >
                    <option>Photography</option>
                    <option>Design</option>
                    <option>Project</option>
                    <option>Activity</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Tanggal</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Image URL</label>
                <input
                  required
                  placeholder="https://..."
                  className={inputClass}
                  value={form.image}
                  onChange={(e) => handleImageChange(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT PREVIEW */}
            <div className="flex flex-col">
              <label className={labelClass}>Preview</label>

              <div className="h-[420px] overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                {!isValidImage && (
                  <div className="flex h-full items-center justify-center px-5 text-center text-sm text-slate-600">
                    Preview akan muncul setelah URL diisi
                  </div>
                )}

                {isValidImage && !imageError && (
                  <img
                    src={getGoogleDriveThumbnailUrl(driveId!)}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                )}

                {imageLoading && (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading image...
                  </div>
                )}

                {imageError && (
                  <div className="flex h-full items-center justify-center px-5 text-center text-sm text-red-400">
                    Gambar tidak dapat dimuat.
                    <br />
                    Cek URL atau permission gambar.
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Gallery"}
          </button>

          {errorMsg && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}