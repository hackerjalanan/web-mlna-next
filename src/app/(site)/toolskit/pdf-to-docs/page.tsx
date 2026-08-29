"use client";

import { useState } from "react";
import { FaCheckCircle, FaDownload, FaFilePdf, FaSpinner } from "react-icons/fa";

export default function PdfToDocsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = async () => {
    if (!file) {
      setError("Pilih file PDF terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/v1/pdf-to-docs", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Gagal mengonversi PDF ke DOCX");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = file.name.replace(/\.pdf$/i, "") || "converted";

      link.href = url;
      link.download = `${fileName}.docx`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      requestAnimationFrame(() => {
        URL.revokeObjectURL(url);
        link.remove();
      });

      setMessage("File DOCX berhasil diunduh.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6 text-slate-100">
      <div className=" bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <FaFilePdf size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Toolskit</p>
            <h1 className="text-2xl font-semibold text-white">PDF to DOCX</h1>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
              <FaFilePdf size={28} />
            </div>
            <div>
              <p className="text-base font-medium text-white">
                {file ? file.name : "Pilih file PDF"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Format yang didukung: PDF"}
              </p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={convert}
            disabled={isLoading || !file}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Mengubah...
              </>
            ) : (
              <>
                <FaDownload />
                Convert PDF to DOCX
              </>
            )}
          </button>

          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Hapus file
            </button>
          )}
        </div>

        {message && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <FaCheckCircle />
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}