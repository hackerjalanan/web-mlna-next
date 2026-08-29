"use client";

import React, { useState } from "react";

const CATEGORIES = [
  { label: "Kurang", min: 0, max: 18.5, color: "#00E6FF", advice: "Konsultasikan pola makan dengan tenaga kesehatan untuk menambah berat badan secara sehat." },
  { label: "Normal", min: 18.5, max: 25, color: "#00B2FF", advice: "Berat badan berada pada rentang sehat. Pertahankan pola makan dan aktivitas fisik." },
  { label: "Lebih", min: 25, max: 30, color: "#006BFF", advice: "Pertimbangkan menambah aktivitas fisik dan menjaga asupan kalori harian." },
  { label: "Obesitas", min: 30, max: 999, color: "#003F8A", advice: "Disarankan berkonsultasi dengan dokter untuk rencana penurunan berat badan yang aman." },
];

const SCALE_MIN = 15;
const SCALE_MAX = 35;

function getCategoryIndex(bmi) {
  return CATEGORIES.findIndex((c) => bmi >= c.min && bmi < c.max);
}

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const h = parseFloat(height.replace(",", "."));
    const w = parseFloat(weight.replace(",", "."));

    if (!h || !w || h < 50 || h > 250 || w < 10 || w > 300) {
      setError("Masukkan tinggi (50–250 cm) dan berat (10–300 kg) yang valid.");
      setResult(null);
      return;
    }

    setError(null);
    setLoading(true);

    // brief, calm loading state — no gimmicks
    window.setTimeout(() => {
      const bmi = w / (h / 100) ** 2;
      setResult({ bmi, categoryIndex: getCategoryIndex(bmi) });
      setLoading(false);
    }, 350);
  }

  const category = result ? CATEGORIES[result.categoryIndex] : null;
  const markerPct = result
    ? Math.min(Math.max(result.bmi, SCALE_MIN), SCALE_MAX)
    : null;
  const markerLeft = markerPct !== null ? ((markerPct - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100 : 0;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-sans"
      
    >
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-sky-200 tracking-tight">
            Kalkulator BMI
          </h1>
          <p className="mt-1.5 text-sm text-sky-300/80">
            Masukkan tinggi dan berat badan untuk menghitung Indeks Massa Tubuh.
          </p>
        </div>
        <div className="bg-[#031826] border border-[#06304a] rounded-xl shadow-lg p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Tinggi (cm)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="170"
                  value={height}
                  disabled={loading}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-lg border border-[#094556] px-3 py-2.5 text-base text-sky-50 outline-none transition-colors focus:border-[#00b7ff] disabled:opacity-60 bg-[#022431]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Berat (kg)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="65"
                  value={weight}
                  disabled={loading}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-lg border border-[#094556] px-3 py-2.5 text-base text-sky-50 outline-none transition-colors focus:border-[#00b7ff] disabled:opacity-60 bg-[#022431]"
                />
              </div>
            </div>

            {error && <p className="text-sm text-[#FF6B81]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00b7ff] text-[#021027] text-sm font-medium py-2.5 transition-colors hover:bg-[#00a0e6] disabled:opacity-70"
            >
              {loading ? "Menghitung…" : "Hitung BMI"}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-4 bg-[#031826] border border-[#06304a] rounded-xl shadow-lg p-6 sm:p-7">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-mono text-4xl font-medium text-gray-900 tabular-nums">
                  {result.bmi.toFixed(1)}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">kg/m²</div>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full text-black"
                style={{ backgroundColor: category.color }}
              >
                {category.label}
              </span>
            </div>

            {/* scale */}
            <div className="mt-5 relative">
              <div className="flex h-1.5 rounded-full overflow-hidden">
                {CATEGORIES.map((c) => {
                  const lo = Math.max(c.min, SCALE_MIN);
                  const hi = Math.min(c.max, SCALE_MAX);
                  const width = ((hi - lo) / (SCALE_MAX - SCALE_MIN)) * 100;
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
          Perhitungan berdasarkan standar WHO. Hasil ini bersifat umum dan bukan pengganti diagnosis medis profesional.
        </p>
      </div>
    </div>
  );
}