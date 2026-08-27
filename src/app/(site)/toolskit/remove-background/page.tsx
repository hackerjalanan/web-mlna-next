"use client";

import { useState, useRef } from "react";
import { FaUpload, FaDownload, FaArrowRotateRight } from "react-icons/fa6";

// Cache instance pipeline transformers.js per model ID, supaya ganti-ganti
// model nggak perlu load ulang model yang sudah pernah dipakai.
const transformersCache: Record<string, any> = {};

// Hanya dua engine yang sudah terbukti bisa diakses publik dari browser:
// - Xenova/modnet lewat @huggingface/transformers
// - @imgly/background-removal, library terpisah yang self-contained
//   (model & runtime-nya bukan lewat HF Hub, jadi bebas dari masalah
//   akses/lisensi repo seperti Xenova/isnet-general-use atau briaai/RMBG-1.4).
const MODEL_OPTIONS = [
  {
    id: "Xenova/modnet",
    engine: "transformers" as const,
    label: "MODNet (portrait, cepat)",
    description: "Optimal untuk foto orang/portrait, ukuran kecil & cepat.",
  },
  {
    id: "imgly",
    engine: "imgly" as const,
    label: "IMG.LY — Objek & Logo (Detail)",
    description: "Library terpisah, general-purpose, biasanya lebih akurat untuk objek non-portrait.",
  },
];

type ModelId = (typeof MODEL_OPTIONS)[number]["id"];

const loadTransformersModel = async (modelId: string) => {
  if (!transformersCache[modelId]) {
    const { pipeline } = await import("@huggingface/transformers");
    transformersCache[modelId] = await pipeline("background-removal", modelId);
  }
  return transformersCache[modelId];
};

// Ubah output RawImage dari transformers.js jadi <canvas>.
const rawImageToCanvas = (resultImage: any): HTMLCanvasElement => {
  const source =
    typeof resultImage.toCanvas === "function" ? resultImage.toCanvas() : resultImage;
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas error");
  ctx.drawImage(source, 0, 0);
  return canvas;
};

// Ubah Blob hasil @imgly/background-removal jadi <canvas>.
const blobToCanvas = (blob: Blob): Promise<HTMLCanvasElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas error"));
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(img.src);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Gagal memuat hasil gambar"));
    img.src = URL.createObjectURL(blob);
  });

// Bersihkan halo/fringing di tepi hasil remove-bg sesuai slider kekuatan.
const applyStrengthToCanvas = async (
  canvas: HTMLCanvasElement,
  strength: number
): Promise<Blob> => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas error");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const factor = strength / 100; // 0..1, makin tinggi = makin agresif bersihin halo

  // Piksel di bawah threshold -> dibuang total (transparan penuh)
  // Piksel di atas ceiling -> dikunci opaque penuh (hilangkan fringing abu-abu)
  // Di antaranya -> di-remap halus, TANPA floor konstan
  const cleanupThreshold = factor * 60; // 0 - 60
  const opacityCeiling = 255 - factor * 40; // 215 - 255

  for (let i = 0; i < data.length; i += 4) {
    let a = data[i + 3];
    if (a <= cleanupThreshold) {
      a = 0;
    } else if (a >= opacityCeiling) {
      a = 255;
    } else {
      a = Math.round(
        ((a - cleanupThreshold) / (opacityCeiling - cleanupThreshold)) * 255
      );
    }
    data[i + 3] = a;
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? new Blob()), "image/png");
  });
};

export default function RemoveBackgroundPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [removeStrength, setRemoveStrength] = useState(60);
  const [hasChangedSetting, setHasChangedSetting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>(MODEL_OPTIONS[0].id);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setResultUrl(null);
    setError(null);
    setOriginalPreview(URL.createObjectURL(file));
  };

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

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value as ModelId);
    setHasChangedSetting(true);
  };

  const preloadImage = (url: string) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
    });

  const handleProcess = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setError(null);
    setProgressPercent(0);

    const activeModel = MODEL_OPTIONS.find((m) => m.id === selectedModel)!;

    try {
      let canvas: HTMLCanvasElement;

      if (activeModel.engine === "transformers") {
        setProgressLabel("Menyiapkan model MODNet...");
        const model = await loadTransformersModel(activeModel.id);

        setProgressLabel("Menganalisa rambut dan objek...");
        setProgressPercent(30);
        const output = await model(originalFile);

        // Pipeline bisa mengembalikan RawImage langsung (untuk 1 gambar input)
        // atau Array<RawImage> (untuk banyak gambar input) — tangani keduanya.
        const resultImage = Array.isArray(output) ? output[0] : output;
        if (!resultImage) {
          throw new Error(
            "Pipeline tidak mengembalikan hasil apa pun (cek console untuk detail)"
          );
        }

        setProgressPercent(70);
        canvas = rawImageToCanvas(resultImage);
      } else {
        setProgressLabel("Menyiapkan @imgly/background-removal...");
        const { removeBackground } = await import("@imgly/background-removal");

        const blob = await removeBackground(originalFile, {
          progress: (key: string, current: number, total: number) => {
            setProgressLabel(`Memproses (${key})...`);
            if (total) setProgressPercent(Math.round((current / total) * 90));
          },
        });

        canvas = await blobToCanvas(blob);
      }

      setProgressLabel("Menyempurnakan edge...");
      const outBlob = await applyStrengthToCanvas(canvas, removeStrength);
      const url = URL.createObjectURL(outBlob);
      await preloadImage(url);

      setResultUrl(url);
      setHasChangedSetting(false);
      setProgressPercent(100);
    } catch (err) {
      console.error(err);
      setError(`Gagal memproses gambar dengan model ${activeModel.label}`);
    } finally {
      setIsProcessing(false);
      setProgressLabel(null);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !originalFile) return;
    const baseName = originalFile.name.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `${baseName}-no-bg.png`;
    link.click();
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalPreview(null);
    setResultUrl(null);
    setHasChangedSetting(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const checkerboardStyle = {
    backgroundImage:
      "linear-gradient(45deg, #334155 25%, transparent 25%), linear-gradient(-45deg, #334155 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #334155 75%), linear-gradient(-45deg, transparent 75%, #334155 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px",
  };

  return (
    <div className="space-y-6">
      {!originalPreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed p-12 text-center transition-colors ${
            isDragging ? "border-cyan-400 bg-cyan-400/5" : "border-white/10 hover:border-cyan-400/30"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
            <FaUpload size={18} />
          </div>
          <p className="text-sm text-white">Klik atau drag & drop gambar</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-xs uppercase text-slate-500">Original</span>
              <div className="flex h-56 items-center justify-center overflow-hidden rounded-sm border border-white/10">
                <img src={originalPreview} className="h-56 w-full object-contain" />
              </div>
            </div>

            <div>
              <span className="mb-2 block text-xs uppercase text-slate-500">Hasil Transparan</span>
              <div
                className="flex h-56 items-center justify-center overflow-hidden rounded-sm"
                style={resultUrl ? checkerboardStyle : undefined}
              >
                {resultUrl ? (
                  <img src={resultUrl} className="h-56 w-full object-contain" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-950/40">
                    {isProcessing ? (
                      <img src="/loading.svg" className="h-10 w-10" />
                    ) : (
                      <span className="text-xs text-slate-500">Belum diproses</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isProcessing && progressLabel && (
            <div className="space-y-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-cyan-400 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-xs text-slate-400">{progressLabel}</p>
            </div>
          )}

          {error && (
            <div className="rounded-sm border border-red-400/20 bg-red-400/5 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Engine Background Removal</label>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              disabled={isProcessing}
              className="w-full rounded-sm border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50 disabled:opacity-50"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              {MODEL_OPTIONS.find((m) => m.id === selectedModel)?.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-slate-300">Kekuatan Remove Background</label>
              <span className="text-sm text-cyan-400">{removeStrength}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={removeStrength}
              onChange={(e) => { setRemoveStrength(Number(e.target.value)); setHasChangedSetting(true); }}
              disabled={isProcessing}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleProcess}
              disabled={isProcessing || (!!resultUrl && !hasChangedSetting)}
              className="flex-1 rounded-sm bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              <FaArrowRotateRight className={isProcessing ? "animate-spin inline" : "inline"} />{" "}
              {isProcessing ? "Memproses..." : resultUrl ? "Selesai Diproses" : "Remove Background"}
            </button>

            {resultUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-sm border border-cyan-400/40 px-4 py-3 text-cyan-400"
              >
                <FaDownload />
                Download PNG
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="rounded-sm border border-white/10 px-4 py-3 text-slate-400"
            >
              Ganti Gambar
            </button>
          </div>
        </>
      )}
    </div>
  );
}