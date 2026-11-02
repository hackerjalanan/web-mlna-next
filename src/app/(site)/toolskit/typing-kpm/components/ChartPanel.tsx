"use client";

import { useState, type MouseEvent } from "react";
import type { Mark, Result, Sample } from "./types";
import { fmt, makeChartSvg, downloadResultPng } from "./utils";

type Props = {
  title: string;
  samples: Sample[];
  marks: Mark[];
  duration: number;
  result: Result | null;
  isLive?: boolean;
};

export default function ChartPanel({
  title,
  samples,
  marks,
  duration,
  result,
}: Props) {
  const [hover, setHover] = useState<{
    index: number;
    x: number;
    y: number;
    width: number;
  } | null>(null);

  const handlePointer = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    const index = target.getAttribute?.("data-i");

    if (index === null || index === undefined) {
      setHover(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setHover({
      index: Number(index),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
    });
  };

  const selectedMark =
    hover && marks[hover.index] ? marks[hover.index] : null;

  return (
    <section className="rounded-2xl bg-slate-800 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-xs text-slate-400">
            Titik merah = salah · titik kuning = pernah salah lalu dikoreksi
          </p>
        </div>

        {result && (
          <button
            type="button"
            onClick={() => downloadResultPng(result)}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
          >
            Unduh PNG
          </button>
        )}
      </div>

      <div
        className="relative w-full"
        onMouseMove={handlePointer}
        onClick={handlePointer}
        onMouseLeave={() => setHover(null)}
      >
        <div
          className="w-full"
          dangerouslySetInnerHTML={{
            __html: makeChartSvg(samples, marks, duration),
          }}
        />

        {selectedMark && hover && (
          <div
            className="pointer-events-none absolute z-20 w-max max-w-[230px] -translate-x-1/2 -translate-y-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-sm shadow-xl"
            style={{
              left: Math.min(Math.max(hover.x, 115), hover.width - 115),
              top: hover.y - 10,
            }}
          >
            <div className="font-mono">
              <span className="text-slate-400">Kata:</span>{" "}
              <b>{selectedMark.word}</b>
            </div>
            <div className="font-mono">
              <span className="text-slate-400">Diketik:</span>{" "}
              <b className={selectedMark.ok ? "text-amber-400" : "text-red-400"}>
                {selectedMark.typed}
              </b>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Detik ke-{fmt(selectedMark.t)}
            </div>
            <div className={selectedMark.ok ? "mt-1 text-amber-400" : "mt-1 text-red-400"}>
              {selectedMark.ok ? "Terkoreksi" : "Salah"} ({selectedMark.wrong}x)
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
        <span><b className="text-amber-400">━</b> KPM</span>
        <span><b className="text-green-400">┅</b> Akurasi</span>
        <span><b className="text-red-400">●</b> Salah</span>
        <span><b className="text-amber-400">●</b> Terkoreksi</span>
      </div>

      {result && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [result.kpm, "KPM"],
            [`${result.acc}%`, "Akurasi"],
            [result.okWords, "Kata benar"],
            [result.badWords, "Kata salah"],
          ].map(([value, label]) => (
            <div key={String(label)} className="rounded-xl bg-slate-900 p-3 text-center">
              <div className="font-mono text-2xl font-bold">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="mt-5">
          <h3 className="mb-3 font-bold">Detail kata yang salah</h3>
          {marks.length === 0 ? (
            <p className="text-sm text-green-400">Tidak ada kesalahan pada tes ini.</p>
          ) : (
            <div className="max-h-64 overflow-auto rounded-xl border border-slate-700">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-3 font-normal">Kata asli</th>
                    <th className="p-3 font-normal">Diketik</th>
                    <th className="p-3 font-normal">Waktu</th>
                    <th className="p-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark, index) => (
                    <tr key={`${mark.t}-${index}`} className="border-t border-slate-700">
                      <td className="p-3 font-mono">{mark.word}</td>
                      <td className={`p-3 font-mono ${mark.ok ? "text-amber-400" : "text-red-400"}`}>
                        {mark.typed}
                      </td>
                      <td className="p-3">{fmt(mark.t)} dtk</td>
                      <td className={`p-3 ${mark.ok ? "text-amber-400" : "text-red-400"}`}>
                        {mark.ok ? "Terkoreksi" : "Salah"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
