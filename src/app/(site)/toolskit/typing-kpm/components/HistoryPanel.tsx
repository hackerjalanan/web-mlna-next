"use client";

import type { Result } from "./types";

type Props = {
  history: Result[];
  selectedId: string | null;
  best: number;
  onSelect: (result: Result) => void;
  onClear: () => void;
};

export default function HistoryPanel({
  history,
  selectedId,
  best,
  onSelect,
  onClear,
}: Props) {
  return (
    <aside className="rounded-2xl bg-slate-800 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Riwayat tes</h2>
        <p className="text-xs text-slate-400">
          Klik salah satu hasil untuk membuka grafik dan mengunduh laporannya.
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-slate-900 p-3">
        <span className="text-amber-400">
          🏆 Terbaik: <b>{best} KPM</b>
        </span>
      </div>

      {history.length === 0 ? (
        <p className="rounded-lg bg-slate-900 p-4 text-center text-sm text-slate-400">
          Belum ada riwayat. Selesaikan tes pertama.
        </p>
      ) : (
        <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
          {history.map((item) => {
            const selected = item.id === selectedId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`block w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-slate-700 bg-slate-900 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-3xl font-bold text-amber-400">
                    {item.kpm}
                  </span>
                  <span className="text-xs text-slate-400">KPM</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{item.lang === "id" ? "🇮🇩" : "🇬🇧"}</span>
                  <span>{item.dur} detik</span>
                  <span>·</span>
                  <span>{item.acc}% akurasi</span>
                </div>

                <div className="mt-3 flex justify-between border-t border-slate-700 pt-3 text-xs">
                  <span className="text-green-400">{item.okWords} benar</span>
                  <span className="text-red-400">{item.badWords} salah</span>
                  <span className="text-amber-400">{item.marks?.length ?? 0} titik</span>
                </div>

                <p className="mt-3 text-xs text-slate-500">{item.date}</p>
                <p className="mt-2 text-xs text-amber-300">
                  {selected ? "Sedang ditampilkan" : "Klik untuk melihat grafik"}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {history.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm text-red-400 hover:text-red-300"
        >
          Hapus semua riwayat
        </button>
      )}
    </aside>
  );
}
