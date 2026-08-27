"use client";

import { useState, useRef, useCallback } from "react";
import { FaUpload, FaDownload, FaArrowRotateRight, FaImage, FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";

type OutputFormat = "image/jpeg" | "image/webp" | "image/png" | "application/pdf";

const FORMAT_OPTIONS: { value: OutputFormat; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "application/pdf", label: "PDF", ext: "pdf" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ImageCompressorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");

  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedDimensions, setCompressedDimensions] = useState({ width: 0, height: 0 });
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isPdf = format === "application/pdf";
  const isLossy = format !== "image/png";

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    setOriginalFile(file);
    setOriginalSize(file.size);
    setCompressedUrl(null);
    setCompressedSize(0);

    const url = URL.createObjectURL(file);
    setOriginalPreview(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
      setMaxWidth((prev) => Math.min(prev, img.width));
    };
    img.src = url;
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const handleCompress = async () => {
    if (!originalPreview) return;
    setIsCompressing(true);

    try {
      const img = new window.Image();
      img.src = originalPreview;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // fill putih dulu untuk format tanpa transparansi (JPEG & PDF)
      if (format === "image/jpeg" || isPdf) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);

      if (isPdf) {
        // PDF: gambar dikompres sebagai JPEG dulu, lalu dibungkus ke dalam file PDF
        const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
        if (!jpegBlob) return;

        const dataUrl = await blobToDataUrl(jpegBlob);

        const pdf = new jsPDF({
          orientation: width > height ? "landscape" : "portrait",
          unit: "px",
          format: [width, height],
        });
        pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);

        const pdfBlob = pdf.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        setCompressedUrl(url);
        setCompressedSize(pdfBlob.size);
        setCompressedDimensions({ width, height });
        setIsCompressing(false);
        return;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          setCompressedUrl(url);
          setCompressedSize(blob.size);
          setCompressedDimensions({ width, height });
          setIsCompressing(false);
        },
        format,
        format === "image/png" ? undefined : quality,
      );
    } catch {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !originalFile) return;
    const ext = FORMAT_OPTIONS.find((f) => f.value === format)?.ext ?? "jpg";
    const baseName = originalFile.name.replace(/\.[^.]+$/, "");

    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `${baseName}-compressed.${ext}`;
    link.click();
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setCompressedUrl(null);
    setCompressedSize(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reduction =
    originalSize && compressedSize
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {!originalPreview ? (
        // UPLOAD ZONE
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-cyan-400 bg-cyan-400/5"
              : "border-white/10 hover:border-cyan-400/30"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
            <FaUpload size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Klik atau drag & drop gambar di sini
            </p>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG, atau WebP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <>
          {/* PREVIEW COMPARISON */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Original
                </span>
                <span className="text-xs text-slate-400">
                  {formatBytes(originalSize)} · {originalDimensions.width}×{originalDimensions.height}
                </span>
              </div>
              <div className="overflow-hidden rounded-sm border border-white/10 bg-slate-950/40">
                <img src={originalPreview} alt="Original" className="h-48 w-full object-contain" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Compressed
                </span>
                {compressedUrl && (
                  <span className="text-xs text-cyan-400">
                    {formatBytes(compressedSize)} · {compressedDimensions.width}×{compressedDimensions.height}
                  </span>
                )}
              </div>
              <div className="flex h-48 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-slate-950/40">
                {compressedUrl ? (
                  isPdf ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-cyan-400">
                      <FaFilePdf size={28} />
                      <span className="text-xs">File PDF siap diunduh</span>
                    </div>
                  ) : (
                    <img src={compressedUrl} alt="Compressed" className="h-48 w-full object-contain" />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <FaImage size={20} />
                    <span className="text-xs">Belum di-compress</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {reduction > 0 && (
            <div className="rounded-sm border border-cyan-400/20 bg-cyan-400/5 px-4 py-2.5 text-sm text-cyan-400">
              Ukuran berkurang <strong>{reduction}%</strong> — dari{" "}
              {formatBytes(originalSize)} menjadi {formatBytes(compressedSize)}
            </div>
          )}

          {/* OPTIONS */}
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-slate-300">Kualitas</label>
                <span className="text-sm font-semibold text-cyan-400">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={!isLossy}
                className="w-full accent-cyan-400 disabled:opacity-40"
              />
              {!isLossy && (
                <p className="mt-1 text-xs text-slate-500">
                  PNG tidak mendukung kompresi lossy (kualitas tetap penuh).
                </p>
              )}
              {isPdf && (
                <p className="mt-1 text-xs text-slate-500">
                  Gambar dikompres sebagai JPEG lalu dibungkus ke dalam file PDF.
                </p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-slate-300">Lebar Maksimum</label>
                <span className="text-sm font-semibold text-cyan-400">{maxWidth}px</span>
              </div>
              <input
                type="range"
                min={320}
                max={originalDimensions.width || 4000}
                step={10}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Format Output</label>
              <div className="flex flex-wrap gap-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFormat(opt.value)}
                    className={`flex-1 rounded-sm border px-3 py-2 text-sm transition-colors ${
                      format === opt.value
                        ? "border-cyan-400/50 bg-cyan-400/10 font-medium text-cyan-400"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCompress}
              disabled={isCompressing}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaArrowRotateRight size={14} className={isCompressing ? "animate-spin" : ""} />
              {isCompressing ? "Compressing..." : "Compress"}
            </button>

            {compressedUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 rounded-sm border border-cyan-400/40 px-4 py-3 text-sm font-semibold text-cyan-400 transition-colors hover:bg-cyan-400/10"
              >
                <FaDownload size={14} />
                Download
              </button>
            )}

            <button
              onClick={handleReset}
              className="rounded-sm border border-white/10 px-4 py-3 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-white"
            >
              Ganti Gambar
            </button>
          </div>
        </>
      )}
    </div>
  );
}