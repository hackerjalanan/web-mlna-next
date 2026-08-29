"use client";

import React, { useState } from "react";

type Gender = "pria" | "wanita";

type Category = {
  label: string;
  min: number;
  max: number;
  color: string;
  advice: string;
};

const CATEGORIES: Record<Gender, Category[]> = {
  pria: [
    { label: "Lemak Esensial", min: 0, max: 6, color: "#5B8DBE", advice: "Kadar lemak sangat rendah, umumnya hanya ditemukan pada atlet kompetitif. Pastikan asupan nutrisi tetap cukup." },
    { label: "Atletis", min: 6, max: 14, color: "#3A8A5C", advice: "Kadar lemak tubuh khas atlet dengan komposisi tubuh yang ramping." },
    { label: "Bugar", min: 14, max: 18, color: "#3A8A5C", advice: "Kadar lemak tubuh berada pada rentang bugar dan sehat." },
    { label: "Rata-rata", min: 18, max: 25, color: "#C68A2E", advice: "Kadar lemak tubuh masih dalam batas wajar. Aktivitas fisik rutin dapat membantu menjaganya." },
    { label: "Tinggi", min: 25, max: 999, color: "#C24A3D", advice: "Disarankan berkonsultasi dengan tenaga kesehatan mengenai pola makan dan aktivitas fisik." },
  ],
  wanita: [
    { label: "Lemak Esensial", min: 0, max: 14, color: "#5B8DBE", advice: "Kadar lemak sangat rendah, umumnya hanya ditemukan pada atlet kompetitif. Pastikan asupan nutrisi tetap cukup." },
    { label: "Atletis", min: 14, max: 21, color: "#3A8A5C", advice: "Kadar lemak tubuh khas atlet dengan komposisi tubuh yang ramping." },
    { label: "Bugar", min: 21, max: 25, color: "#3A8A5C", advice: "Kadar lemak tubuh berada pada rentang bugar dan sehat." },
    { label: "Rata-rata", min: 25, max: 32, color: "#C68A2E", advice: "Kadar lemak tubuh masih dalam batas wajar. Aktivitas fisik rutin dapat membantu menjaganya." },
    { label: "Tinggi", min: 32, max: 999, color: "#C24A3D", advice: "Disarankan berkonsultasi dengan tenaga kesehatan mengenai pola makan dan aktivitas fisik." },
  ],
};

const SCALE_MIN = 3;
const SCALE_MAX = 40;

function getCategoryIndex(gender: Gender, bf: number) {
  const cats = CATEGORIES[gender];
  const idx = cats.findIndex((c) => bf >= c.min && bf < c.max);
  return idx === -1 ? cats.length - 1 : idx;
}

// U.S. Navy method — all measurements in cm
function calcBodyFat(gender: Gender, height: number, neck: number, waist: number, hip: number) {
  if (gender === "pria") {
    return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  }
  return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>("pria");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ bf: number; categoryIndex: number } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const h = parseFloat(height.replace(",", "."));
    const n = parseFloat(neck.replace(",", "."));
    const w = parseFloat(waist.replace(",", "."));
    const p = parseFloat(hip.replace(",", "."));

    const baseValid = h >= 100 && h <= 250 && n >= 15 && n <= 80 && w >= 40 && w <= 200;
    const hipValid = gender === "pria" ? true : p >= 40 && p <= 200;

    if (!baseValid || !hipValid || (gender === "pria" && w <= n)) {
      setError("Periksa kembali ukuran yang dimasukkan (lingkar pinggang harus lebih besar dari leher).");
      setResult(null);
      return;
    }

    setError(null);
    setLoading(true);

    window.setTimeout(() => {
      const bf = calcBodyFat(gender, h, n, w, p);
      setResult({ bf, categoryIndex: getCategoryIndex(gender, bf) });
      setLoading(false);
    }, 350);
  }

  const cats = CATEGORIES[gender];
  const category = result ? cats[result.categoryIndex] : null;
  const markerPct = result ? Math.min(Math.max(result.bf, SCALE_MIN), SCALE_MAX) : null;
  const markerLeft = markerPct !== null ? ((markerPct - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100 : 0;

  function switchGender(g: Gender) {
    setGender(g);
    setResult(null);
    setError(null);
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12 font-sans"
      
    >
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-sky-100 tracking-tight">
            Kalkulator Persentase Lemak Tubuh
          </h1>
          <p className="mt-1.5 text-sm text-sky-200/80">
            Menggunakan metode U.S. Navy berdasarkan lingkar tubuh.
          </p>
        </div>
        <div className="bg-[#031425] border border-[#083047] rounded-xl shadow-lg p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => switchGender("pria")}
                  disabled={loading}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    gender === "pria"
                      ? "border-transparent bg-[#0b4b66] text-sky-100"
                      : "border-[#083047] text-sky-200 hover:border-[#0ea5bf]"
                  }`}
                >
                  Pria
                </button>
                <button
                  type="button"
                  onClick={() => switchGender("wanita")}
                  disabled={loading}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    gender === "wanita"
                      ? "border-transparent bg-[#0b4b66] text-sky-100"
                      : "border-[#083047] text-sky-200 hover:border-[#0ea5bf]"
                  }`}
                >
                  Wanita
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-sky-200 mb-1.5">
                  Tinggi (cm)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="170"
                  value={height}
                  disabled={loading}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-lg border border-[#083047] px-3 py-2.5 text-base text-sky-100 bg-[#021826] outline-none transition-colors focus:border-[#0ea5bf] disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-sky-200 mb-1.5">
                  Leher (cm)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="37"
                  value={neck}
                  disabled={loading}
                  onChange={(e) => setNeck(e.target.value)}
                  className="w-full rounded-lg border border-[#083047] px-3 py-2.5 text-base text-sky-100 bg-[#021826] outline-none transition-colors focus:border-[#0ea5bf] disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-sky-200 mb-1.5">
                  Pinggang (cm)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="80"
                  value={waist}
                  disabled={loading}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full rounded-lg border border-[#083047] px-3 py-2.5 text-base text-sky-100 bg-[#021826] outline-none transition-colors focus:border-[#0ea5bf] disabled:opacity-60"
                />
              </div>
              {gender === "wanita" && (
                <div>
                  <label className="block text-xs font-medium text-sky-200 mb-1.5">
                    Pinggul (cm)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="95"
                    value={hip}
                    disabled={loading}
                    onChange={(e) => setHip(e.target.value)}
                    className="w-full rounded-lg border border-[#083047] px-3 py-2.5 text-base text-sky-100 bg-[#021826] outline-none transition-colors focus:border-[#0ea5bf] disabled:opacity-60"
                  />
                </div>
              )}
            </div>

            {error && <p className="text-sm text-[#FF8A92]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0b6f95] text-sky-100 text-sm font-medium py-2.5 transition-colors hover:bg-[#0a5f84] disabled:opacity-70"
            >
              {loading ? "Menghitung…" : "Hitung Lemak Tubuh"}
            </button>
          </form>
        </div>

        {result && category && (
          <div className="mt-4 bg-[#031425] border border-[#083047] rounded-xl shadow-lg p-6 sm:p-7">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-mono text-4xl font-medium text-sky-100 tabular-nums">
                  {result.bf.toFixed(1)}
                </div>
                <div className="text-xs text-sky-200 mt-0.5">% lemak tubuh</div>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full text-black"
                style={{ backgroundColor: category.color, opacity: 0.95 }}
              >
                {category.label}
              </span>
            </div>

            {/* scale */}
            <div className="mt-5 relative">
              <div className="flex h-1.5 rounded-full overflow-hidden">
                {cats.map((c) => {
                  const lo = Math.max(c.min, SCALE_MIN);
                  const hi = Math.min(c.max, SCALE_MAX);
                  const width = Math.max(((hi - lo) / (SCALE_MAX - SCALE_MIN)) * 100, 0);
                  return (
                    <div key={c.label} style={{ width: `${width}%`, backgroundColor: c.color, opacity: 0.28 }} />
                  );
                })}
              </div>
              <div
                className="absolute -top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
                style={{
                  left: `calc(${markerLeft}% - 7px)`,
                  backgroundColor: category.color,
                }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-sky-200">
              {category.advice}
            </p>
          </div>
        )}

        <p className="mt-5 text-xs text-sky-300 leading-relaxed">
          Estimasi menggunakan rumus U.S. Navy. Hasil ini bersifat umum dan bukan pengganti pengukuran klinis atau diagnosis medis profesional.
        </p>
      </div>
    </div>
  );
}