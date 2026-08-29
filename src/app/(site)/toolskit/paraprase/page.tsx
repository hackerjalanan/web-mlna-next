"use client";

import { useMemo, useRef, useState } from "react";

interface ParaphraseResponse {
  success: boolean;
  message: string;
  data: {
    original: string;
    paraphrased: string;
    style: string;
  };
}

const STYLE_OPTIONS = [
  { value: "natural", label: "Natural" },
  { value: "formal", label: "Formal" },
  { value: "singkat", label: "Singkat" },
  { value: "santai", label: "Santai" },
];

// Urutan warna untuk pasangan kata yang berubah (kiri <-> kanan)
const COLORS = [
  { text: "text-red-300", bg: "bg-red-500/20", ring: "ring-red-500/40" },
  { text: "text-yellow-300", bg: "bg-yellow-500/20", ring: "ring-yellow-500/40" },
  { text: "text-green-300", bg: "bg-green-500/20", ring: "ring-green-500/40" },
  { text: "text-blue-300", bg: "bg-blue-500/20", ring: "ring-blue-500/40" },
];

// Pisahkan string jadi token kata & non-kata, urutan tetap sama
function tokenize(str: string): string[] {
  return str.split(/(\p{L}+)/gu);
}

const isWord = (token: string) => /\p{L}+/u.test(token);

interface DiffResult {
  originalNodes: { text: string; colorIndex: number | null }[];
  paraphrasedNodes: { text: string; colorIndex: number | null }[];
}

// Bandingkan token asli vs hasil, tandai kata yang berbeda dengan warna
// yang sama di kedua sisi (berpasangan berdasar urutan kemunculan).
function buildDiff(original: string, paraphrased: string): DiffResult {
  const origTokens = tokenize(original);
  const paraTokens = tokenize(paraphrased);

  const originalNodes: DiffResult["originalNodes"] = [];
  const paraphrasedNodes: DiffResult["paraphrasedNodes"] = [];

  if (origTokens.length !== paraTokens.length) {
    // Fallback: struktur token tidak sama, tampilkan tanpa highlight
    return {
      originalNodes: [{ text: original, colorIndex: null }],
      paraphrasedNodes: [{ text: paraphrased, colorIndex: null }],
    };
  }

  let colorCursor = 0;
  for (let i = 0; i < origTokens.length; i++) {
    const o = origTokens[i];
    const p = paraTokens[i];
    const changed = isWord(o) && o.toLowerCase() !== p.toLowerCase();
    const colorIndex = changed ? colorCursor % COLORS.length : null;
    if (changed) colorCursor++;

    originalNodes.push({ text: o, colorIndex });
    paraphrasedNodes.push({ text: p, colorIndex });
  }

  return { originalNodes, paraphrasedNodes };
}

function HighlightedText({ nodes }: { nodes: DiffResult["originalNodes"] }) {
  return (
    <>
      {nodes.map((node, i) =>
        node.colorIndex === null ? (
          <span key={i}>{node.text}</span>
        ) : (
          <span
            key={i}
            className={`rounded px-1 ring-1 ${COLORS[node.colorIndex].bg} ${COLORS[node.colorIndex].text} ${COLORS[node.colorIndex].ring}`}
          >
            {node.text}
          </span>
        ),
      )}
    </>
  );
}

export default function ParaphrasePage() {
  const [text, setText] = useState(
    "Perubahan ini sangat penting karena dapat membuat hasil menjadi lebih baik.",
  );
  const [result, setResult] = useState<string>("");
  const [style, setStyle] = useState("natural");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingSource, setIsEditingSource] = useState(true);

  const resultRef = useRef<HTMLDivElement>(null);

  const diff = useMemo(() => {
    if (!result) return null;
    return buildDiff(text, result);
  }, [text, result]);

  const handleParaphrase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style }),
      });

      const data: ParaphraseResponse = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Gagal memanggil API paraphrase");
      }

      setResult(data.data?.paraphrased ?? "");
      setIsEditingSource(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSource = () => {
    setIsEditingSource(true);
    setResult("");
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-0 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Paraphrase</h1>
        {!isEditingSource && (
          <button
            type="button"
            onClick={handleEditSource}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Edit teks asli
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Gaya
        </span>
        {STYLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStyle(option.value)}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              style === option.value
                ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Kolom kiri: teks asli */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Teks asli
          </p>

          {isEditingSource ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-56 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm leading-7 outline-none focus:border-cyan-400"
              placeholder="Masukkan teks..."
            />
          ) : (
            <div className="min-h-56 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm leading-7">
              {diff ? <HighlightedText nodes={diff.originalNodes} /> : text}
            </div>
          )}
        </div>

        {/* Kolom kanan: hasil parafrase (bisa diedit) */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Hasil paraphrase{result && " (bisa diedit)"}
          </p>

          <div
            ref={resultRef}
            contentEditable={Boolean(result)}
            suppressContentEditableWarning
            className={`min-h-56 w-full rounded-md border p-3 text-sm leading-7 outline-none ${
              result
                ? "border-slate-700 bg-slate-900 focus:border-cyan-400"
                : "border-dashed border-slate-800 bg-slate-950 text-slate-500"
            }`}
          >
            {result ? (
              diff ? (
                <HighlightedText nodes={diff.paraphrasedNodes} />
              ) : (
                result
              )
            ) : (
              "Hasil akan muncul di sini setelah diproses."
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleParaphrase}
          disabled={isLoading || !text.trim() || !isEditingSource}
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Parafrase"}
        </button>

        {diff && (
          <p className="text-xs text-slate-500">
            Kata yang diberi warna sama menunjukkan pasangan kata asli ↔ hasil.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </main>
  );
}