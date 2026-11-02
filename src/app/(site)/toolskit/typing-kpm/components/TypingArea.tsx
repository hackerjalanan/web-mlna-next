
"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { Lang, Rec } from "./types";

type Props = {
  lang: Lang;
  words: string[];
  wordIndex: number;
  current: string;
  records: Rec[];
  focused: boolean;
  status: "idle" | "running" | "done";
  elapsed: number;
  duration: number;
  onType: (value: string) => void;
  onReset: () => void;
  onFocusChange: (value: boolean) => void;
};

export default function TypingArea({
  lang,
  words,
  wordIndex,
  current,
  records,
  focused,
  status,
  elapsed,
  duration,
  onType,
  onReset,
  onFocusChange,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [rows, setRows] = useState<number[][]>([]);
  const [rowInput, setRowInput] = useState("5");
  const [firstVisibleRow, setFirstVisibleRow] = useState(0);

  // ==========================================
  // PENGATURAN JUMLAH BARIS
  // ==========================================

  const visibleRowCount = Math.min(
    30,
    Math.max(1, Number(rowInput) || 1)
  );

  // Posisi mengetik satu baris sebelum baris terakhir.
  // Contoh: 30 baris = posisi mengetik baris ke-29.
  const typingPosition = Math.max(
    0,
    visibleRowCount - 2
  );

  // ==========================================
  // MENGUKUR DAN MEMBAGI BARIS
  // ==========================================

  useLayoutEffect(() => {
    const box = boxRef.current;
    const measure = measureRef.current;

    if (!box || !measure) return;

    const updateRows = () => {
      const children = Array.from(
        measure.children
      ) as HTMLElement[];

      const groupedRows: number[][] = [];

      let previousTop: number | null = null;

      children.forEach((element, index) => {
        const top = element.getBoundingClientRect().top;

        if (
          previousTop === null ||
          Math.abs(top - previousTop) > 2
        ) {
          groupedRows.push([]);
          previousTop = top;
        }

        groupedRows[groupedRows.length - 1].push(index);
      });

      setRows(groupedRows);
    };

    updateRows();

    const observer = new ResizeObserver(() => {
      updateRows();
    });

    observer.observe(box);
    observer.observe(measure);

    window.addEventListener("resize", updateRows);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRows);
    };
  }, [words]);

  // ==========================================
  // BARIS AKTIF
  // ==========================================

  const foundActiveRow = rows.findIndex((row) =>
    row.includes(wordIndex)
  );

  const activeRow =
    foundActiveRow >= 0
      ? foundActiveRow
      : Math.max(0, rows.length - 1);

  // ==========================================
  // PERGESERAN BARIS OTOMATIS
  // ==========================================

  useLayoutEffect(() => {
    if (rows.length === 0) return;

    setFirstVisibleRow((previous) => {
      const currentPosition = activeRow - previous;

      // Geser hanya jika cursor melewati posisi yang ditentukan.
      if (currentPosition > typingPosition) {
        const nextPosition = activeRow - typingPosition;

        return Math.min(
          nextPosition,
          Math.max(0, rows.length - visibleRowCount)
        );
      }

      return previous;
    });
  }, [
    activeRow,
    typingPosition,
    rows.length,
    visibleRowCount,
  ]);

  // ==========================================
  // BATAS POSISI TAMPILAN
  // ==========================================

  useLayoutEffect(() => {
    if (rows.length === 0) return;

    const maxFirstRow = Math.max(
      0,
      rows.length - visibleRowCount
    );

    setFirstVisibleRow((previous) =>
      Math.min(
        Math.max(0, previous),
        maxFirstRow
      )
    );
  }, [rows.length, visibleRowCount]);

  // ==========================================
  // BARIS YANG DITAMPILKAN
  // ==========================================

  const visibleRows = rows.slice(
    firstVisibleRow,
    firstVisibleRow + visibleRowCount
  );

  // Pastikan jumlah slot selalu sesuai pengaturan.
  const displayRows = Array.from(
    { length: visibleRowCount },
    (_, index) => visibleRows[index] ?? []
  );

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setFirstVisibleRow(0);
    onReset();
  };

  // ==========================================
  // WAKTU
  // ==========================================

  const remainingTime = Math.max(
    0,
    Math.ceil(duration - elapsed)
  );

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  // ==========================================
  // RENDER KATA
  // ==========================================

  const renderWord = (word: string, index: number) => {
    if (index < wordIndex) {
      const record = records[index];

      return (
        <span
          key={index}
          className={
            record?.ok
              ? "text-slate-100"
              : "text-red-400 underline decoration-red-400/60"
          }
        >
          {word}
        </span>
      );
    }

    if (index === wordIndex) {
      return (
        <span
          key={index}
          className="rounded bg-slate-700/70"
        >
          {word.split("").map((character, charIndex) => {
            let className = "text-slate-400";

            if (charIndex < current.length) {
              className =
                current[charIndex] === character
                  ? "text-slate-100"
                  : "bg-red-500/30 text-red-400";
            }

            if (charIndex === current.length) {
              className += " border-b-2 border-amber-400";
            }

            return (
              <span
                key={charIndex}
                className={className}
              >
                {character}
              </span>
            );
          })}

          {current.length > word.length && (
            <span className="bg-red-500/30 text-red-400">
              {current.slice(word.length)}
            </span>
          )}
        </span>
      );
    }

    return (
      <span
        key={index}
        className="text-slate-500"
      >
        {word}
      </span>
    );
  };

  // ==========================================
  // INFORMASI TAMPILAN
  // ==========================================

  const flag = lang === "id" ? "🇮🇩" : "🇬🇧";

  const progress = Math.min(
    100,
    (elapsed / duration) * 100
  );

  const rowHeight = 40;
  const verticalPadding = 24;

  const areaHeight =
    visibleRowCount * rowHeight + verticalPadding;

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="rounded-2xl bg-slate-800 p-4">

      {/* HEADER */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">
            {flag} Typing Test
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* WAKTU */}
          <div className="rounded-lg bg-slate-900 px-3 py-2">
            <span className="mr-2 text-xs text-slate-400">
              Waktu
            </span>

            <span className="font-mono text-lg font-bold tabular-nums text-amber-400">
              {formattedTime}
            </span>
          </div>

          {/* JUMLAH BARIS */}
          <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2">
            <label
              htmlFor="row-count"
              className="text-xs text-slate-400"
            >
              Baris
            </label>

            <input
              id="row-count"
              type="number"
              min={1}
              max={30}
              value={rowInput}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "") {
                  setRowInput("");
                  return;
                }

                const number = Number(value);

                if (number >= 1 && number <= 30) {
                  setRowInput(value);
                }
              }}
              onBlur={() => {
                const number = Number(rowInput);

                setRowInput(
                  String(
                    Math.min(30, Math.max(1, number || 1))
                  )
                );
              }}
              className="w-12 bg-transparent text-center text-sm font-bold text-white outline-none"
            />
          </div>

          {/* RESET */}
          <button
            type="button"
            onClick={handleReset}
            title="Acak ulang"
            aria-label="Acak ulang"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 7v5h-5" />
              <path d="M4 17v-5h5" />
              <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
              <path d="M18.4 15a7 7 0 0 1-11.6 2L4 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* AREA MENGETIK */}
      <div
        ref={boxRef}
        onClick={() => inputRef.current?.focus()}
        className="relative cursor-text overflow-hidden rounded-xl bg-slate-900 px-4 py-3"
        style={{
          height: `${areaHeight}px`,
        }}
      >

        {/* PENGUKUR BARIS */}
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-4 right-4 top-3 flex flex-wrap content-start gap-x-3 font-mono text-2xl leading-10"
        >
          {words.map((word, index) => (
            <span
              key={index}
              className="whitespace-nowrap"
            >
              {word}
            </span>
          ))}
        </div>

        {/* BARIS KATA */}
        <div
          className={`flex flex-col font-mono text-2xl leading-10 ${
            focused || status === "done" ? "" : "blur-sm"
          }`}
        >
          {displayRows.map((row, rowIndex) => (
            <div
              key={row[0] ?? `empty-${firstVisibleRow + rowIndex}`}
              className="flex h-10 shrink-0 flex-nowrap items-center gap-x-3 whitespace-nowrap"
            >
              {row.map((index) =>
                renderWord(words[index], index)
              )}
            </div>
          ))}
        </div>

        {/* OVERLAY */}
        {!focused && status !== "done" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 px-3 text-center text-lg font-bold text-amber-300">
            Klik di sini lalu mulai mengetik
          </div>
        )}

        {/* INPUT TERSEMBUNYI */}
        <input
          ref={inputRef}
          value={current}
          onChange={(event) => onType(event.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onPaste={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              handleReset();
              return;
            }

            if (event.key === " ") {
              event.preventDefault();

              if (current.length > 0) {
                onType(`${current} `);
              }
            }
          }}
          disabled={status === "done"}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Kolom mengetik"
          className="absolute left-0 top-0 h-px w-px opacity-0"
        />
      </div>

      {/* PROGRESS */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div
          className="h-full bg-amber-400 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </section>
  );
}
