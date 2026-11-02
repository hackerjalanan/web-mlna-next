
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import TypingArea from "./components/TypingArea";
import ChartPanel from "./components/ChartPanel";
import HistoryPanel from "./components/HistoryPanel";

import { DURATIONS, LANGS, makeWords } from "./components/data";
import { calcStats } from "./components/utils";

import type {
  Lang,
  Mark,
  Rec,
  Result,
  Sample,
} from "./components/types";

const STORAGE_KEY = "typing-app";

// Pengaturan stok kata
const INITIAL_WORD_COUNT = 1000;
const WORD_BATCH_SIZE = 1000;
const REFILL_THRESHOLD = 100;

export default function Page() {
  const [lang, setLang] = useState<Lang>("id");
  const [duration, setDuration] = useState(30);

  const [words, setWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [current, setCurrent] = useState("");

  const [records, setRecords] = useState<Rec[]>([]);
  const [keys, setKeys] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [samples, setSamples] = useState<Sample[]>([]);

  const [status, setStatus] = useState<
    "idle" | "running" | "done"
  >("idle");

  const [elapsed, setElapsed] = useState(0);
  const [focused, setFocused] = useState(false);

  const [history, setHistory] = useState<Result[]>([]);
  const [best, setBest] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const startedAt = useRef(0);
  const lastSecond = useRef(0);

  const currentWrong = useRef(0);
  const firstErrorAt = useRef<number | null>(null);

  const shouldSaveResult = useRef(false);

  const statsRef = useRef({
    correct: 0,
    keys: 0,
    wrong: 0,
  });

  // ==========================================
  // STATISTIK
  // ==========================================

  const correctChars = useMemo(() => {
    const completed = records.reduce(
      (sum, record) =>
        sum + (record.ok ? record.word.length + 1 : 0),
      0
    );

    const currentCorrect = words[wordIndex]?.startsWith(current)
      ? current.length
      : 0;

    return completed + currentCorrect;
  }, [records, words, wordIndex, current]);

  statsRef.current = {
    correct: correctChars,
    keys,
    wrong,
  };

  const liveStats = calcStats(
    correctChars,
    keys,
    wrong,
    Math.max(elapsed, 1)
  );

  // ==========================================
  // MARKS KESALAHAN
  // ==========================================

  const currentMarks: Mark[] = useMemo(
    () =>
      records
        .filter((record) => record.wrong > 0)
        .map((record) => ({
          t: record.errAt ?? 0,
          word: record.word,
          typed: record.typed,
          ok: record.ok,
          wrong: record.wrong,
        })),
    [records]
  );

  // ==========================================
  // RIWAYAT TERPILIH
  // ==========================================

  const selectedResult =
    history.find((item) => item.id === selectedId) ?? null;

  const displaySamples =
    status === "running" || status === "idle"
      ? samples
      : selectedResult?.samples ?? samples;

  const displayMarks =
    status === "running" || status === "idle"
      ? currentMarks
      : selectedResult?.marks ?? currentMarks;

  const displayDuration =
    status === "running" || status === "idle"
      ? duration
      : selectedResult?.dur ?? duration;

  const displayResult =
    status === "done" ? selectedResult : null;

  const langLabel = LANGS.find(
    (item) => item.id === lang
  )!;

  // ==========================================
  // FORMAT WAKTU
  // ==========================================

  const remaining = Math.max(
    0,
    Math.ceil(duration - elapsed)
  );

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, Math.ceil(seconds));

    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = seconds / 60;

    return `${new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(minutes)} menit`;
  };

  // ==========================================
  // GENERATE KATA
  // ==========================================

  const generateWordList = (nextLang: Lang) => {
    return makeWords(nextLang, INITIAL_WORD_COUNT);
  };

  // ==========================================
  // RESET TEST
  // ==========================================

  const resetTest = (
    nextLang: Lang = lang,
    nextDuration = duration
  ) => {
    shouldSaveResult.current = false;

    setLang(nextLang);
    setDuration(nextDuration);

    // Buat stok kata baru
    setWords(generateWordList(nextLang));

    setWordIndex(0);
    setCurrent("");

    setRecords([]);
    setKeys(0);
    setWrong(0);
    setSamples([]);

    setElapsed(0);
    setStatus("idle");

    setSelectedId(null);
    setFocused(false);

    currentWrong.current = 0;
    firstErrorAt.current = null;

    lastSecond.current = 0;
    startedAt.current = 0;

    window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[aria-label="Kolom mengetik"]'
      );

      input?.focus();
    }, 0);
  };

  // ==========================================
  // LOAD LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    let initialLang: Lang = "id";
    let initialDuration = 30;

    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "{}"
      );

      if (saved.lang === "id" || saved.lang === "en") {
        initialLang = saved.lang;
        setLang(saved.lang);
      }

      if (DURATIONS.includes(saved.duration)) {
        initialDuration = saved.duration;
        setDuration(saved.duration);
      }

      if (Array.isArray(saved.history)) {
        const normalized: Result[] = saved.history.map(
          (item: Result) => ({
            ...item,
            id:
              item.id ??
              `${Date.now()}-${Math.random()}`,

            marks: Array.isArray(item.marks)
              ? item.marks
              : [],

            samples: Array.isArray(item.samples)
              ? item.samples
              : [],
          })
        );

        setHistory(normalized);
      }

      if (typeof saved.best === "number") {
        setBest(saved.best);
      }
    } catch {
      // Abaikan localStorage yang rusak.
    }

    // Stok awal 1.000 kata
    setWords(generateWordList(initialLang));

    setLoaded(true);
  }, []);

  // ==========================================
  // SIMPAN LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lang,
          duration,
          history,
          best,
        })
      );
    } catch {
      // Abaikan jika localStorage penuh.
    }
  }, [lang, duration, history, best, loaded]);

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (status !== "running") return;

    const timer = window.setInterval(() => {
      const seconds =
        (Date.now() - startedAt.current) / 1000;

      if (seconds >= duration) {
        setElapsed(duration);

        shouldSaveResult.current = true;
        setStatus("done");

        return;
      }

      setElapsed(seconds);

      const wholeSecond = Math.floor(seconds);

      if (wholeSecond > lastSecond.current) {
        lastSecond.current = wholeSecond;

        const stats = statsRef.current;

        const calculated = calcStats(
          stats.correct,
          stats.keys,
          stats.wrong,
          wholeSecond
        );

        setSamples((previous) => [
          ...previous,
          {
            t: wholeSecond,
            kpm: calculated.kpm,
            acc: calculated.acc,
          },
        ]);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [status, duration]);

  // ==========================================
  // SIMPAN HASIL TES
  // ==========================================

  useEffect(() => {
    if (
      status !== "done" ||
      !shouldSaveResult.current
    ) {
      return;
    }

    shouldSaveResult.current = false;

    const finalRecords = [...records];

    if (
      current &&
      words[wordIndex] &&
      currentWrong.current > 0
    ) {
      finalRecords.push({
        word: words[wordIndex],
        typed: current,
        ok: false,
        wrong: currentWrong.current,
        errAt: firstErrorAt.current,
      });
    }

    const marks: Mark[] = finalRecords
      .filter((record) => record.wrong > 0)
      .map((record) => ({
        t: record.errAt ?? 0,
        word: record.word,
        typed: record.typed,
        ok: record.ok,
        wrong: record.wrong,
      }));

    const stats = calcStats(
      correctChars,
      keys,
      wrong,
      duration
    );

    const okWords = finalRecords.filter(
      (record) => record.ok
    ).length;

    const badWords = finalRecords.length - okWords;

    const finalSamples = [
      ...samples.filter(
        (sample) => sample.t !== duration
      ),
      {
        t: duration,
        kpm: stats.kpm,
        acc: stats.acc,
      },
    ];

    const result: Result = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      ...stats,

      errors: wrong,
      okWords,
      badWords,

      lang,
      dur: duration,

      date: new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),

      marks,
      samples: finalSamples,
    };

    setRecords(finalRecords);
    setSamples(finalSamples);

    setHistory((previous) =>
      [result, ...previous].slice(0, 20)
    );

    setSelectedId(result.id);

    setBest((previous) =>
      Math.max(previous, result.kpm)
    );
  }, [status]);

  // ==========================================
  // PROSES PENGETIKAN
  // ==========================================

  const handleTyping = (rawValue: string) => {
    if (status === "done") return;

    const targetWord = words[wordIndex];

    if (!targetWord) return;

    const spaceIndex = rawValue.indexOf(" ");

    const value =
      spaceIndex >= 0
        ? rawValue.slice(0, spaceIndex)
        : rawValue;

    if (value.length > targetWord.length + 8) {
      return;
    }

    // Mulai timer saat karakter pertama diketik.
    if (status === "idle" && value.length > 0) {
      startedAt.current = Date.now();
      lastSecond.current = 0;

      setSamples([
        {
          t: 0,
          kpm: 0,
          acc: 100,
        },
      ]);

      setStatus("running");
    }

    const timeNow =
      status === "idle"
        ? 0
        : (Date.now() - startedAt.current) / 1000;

    let addedKeys = 0;
    let addedWrong = 0;

    // Menghitung karakter baru.
    for (
      let index = current.length;
      index < value.length;
      index++
    ) {
      addedKeys++;

      if (value[index] !== targetWord[index]) {
        addedWrong++;

        currentWrong.current++;

        if (firstErrorAt.current === null) {
          firstErrorAt.current = timeNow;
        }
      }
    }

    // ========================================
    // JIKA MENEKAN SPASI
    // ========================================

    if (spaceIndex >= 0) {
      if (!value) return;

      const isCorrect = value === targetWord;

      if (
        !isCorrect &&
        currentWrong.current === 0
      ) {
        addedKeys++;
        addedWrong++;

        currentWrong.current = 1;
        firstErrorAt.current = timeNow;
      }

      const newRecord: Rec = {
        word: targetWord,
        typed: value,
        ok: isCorrect,
        wrong: currentWrong.current,
        errAt: firstErrorAt.current,
      };

      setRecords((previous) => [
        ...previous,
        newRecord,
      ]);

      currentWrong.current = 0;
      firstErrorAt.current = null;

      setWordIndex((previous) => previous + 1);
      setCurrent("");

      // ======================================
      // TAMBAH STOK KATA OTOMATIS
      // ======================================

      const remainingWords =
        words.length - (wordIndex + 1);

      if (remainingWords < REFILL_THRESHOLD) {
        setWords((previous) => [
          ...previous,
          ...makeWords(lang, WORD_BATCH_SIZE),
        ]);
      }
    } else {
      setCurrent(value);
    }

    // ========================================
    // UPDATE STATISTIK
    // ========================================

    if (addedKeys > 0) {
      setKeys((previous) => previous + addedKeys);
    }

    if (addedWrong > 0) {
      setWrong((previous) => previous + addedWrong);
    }
  };

  // ==========================================
  // GANTI BAHASA
  // ==========================================

  const changeLanguage = (nextLang: Lang) => {
    resetTest(nextLang, duration);
  };

  // ==========================================
  // GANTI DURASI
  // ==========================================

  const changeDuration = (nextDuration: number) => {
    resetTest(lang, nextDuration);
  };

  // ==========================================
  // PILIH RIWAYAT
  // ==========================================

  const selectHistory = (result: Result) => {
    shouldSaveResult.current = false;

    setSelectedId(result.id);

    setStatus("done");
    setElapsed(result.dur);

    setDuration(result.dur);
    setLang(result.lang);

    setFocused(false);
  };

  // ==========================================
  // HAPUS RIWAYAT
  // ==========================================

  const clearHistory = () => {
    if (
      !window.confirm(
        "Yakin ingin menghapus semua riwayat tes?"
      )
    ) {
      return;
    }

    setHistory([]);
    setBest(0);

    setSelectedId(null);
    setStatus("idle");
    setElapsed(0);
  };

  // ==========================================
  // DATA STATISTIK YANG DITAMPILKAN
  // ==========================================

  const shownKpm =
    status === "done" && selectedResult
      ? selectedResult.kpm
      : liveStats.kpm;

  const shownCpm =
    status === "done" && selectedResult
      ? selectedResult.cpm
      : liveStats.cpm;

  const shownAccuracy =
    status === "done" && selectedResult
      ? selectedResult.acc
      : liveStats.acc;

  const shownErrors =
    status === "done" && selectedResult
      ? selectedResult.errors
      : wrong;

  const shownTime =
    status === "running"
      ? remaining
      : status === "done" && selectedResult
        ? selectedResult.dur
        : duration;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screenp-0 text-white sm:p-0">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* PENGATURAN DAN STATISTIK */}
        <section className=" p-0 sm:p-0">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* BAHASA DAN DURASI */}
            <div className="flex flex-wrap items-center gap-2">

              <select
                value={lang}
                onChange={(event) =>
                  changeLanguage(
                    event.target.value as Lang
                  )
                }
                aria-label="Pilih bahasa"
                className="min-w-28 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
              >
                {LANGS.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.flag} {item.name}
                  </option>
                ))}
              </select>

              <select
                value={duration}
                onChange={(event) =>
                  changeDuration(
                    Number(event.target.value)
                  )
                }
                aria-label="Pilih durasi"
                className="min-w-32 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
              >
                {DURATIONS.map((seconds) => (
                  <option
                    key={seconds}
                    value={seconds}
                  >
                    {formatDuration(seconds)}
                  </option>
                ))}
              </select>
            </div>

            {/* KPM */}
            <div className="flex items-center gap-2">
              <div className="font-mono text-4xl font-bold text-amber-400 sm:text-5xl">
                {shownKpm}
              </div>

              <div className="text-xs leading-tight text-slate-400">
                Kata
                <br />
                per menit
              </div>
            </div>

            {/* STATISTIK */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">

              <div>
                <div className="font-mono text-lg font-bold">
                  {shownCpm}
                </div>
                <div className="text-xs text-slate-400">
                  CPM
                </div>
              </div>

              <div>
                <div className="font-mono text-lg font-bold">
                  {shownAccuracy}%
                </div>
                <div className="text-xs text-slate-400">
                  Akurasi
                </div>
              </div>

              <div>
                <div className="font-mono text-lg font-bold">
                  {shownErrors}
                </div>
                <div className="text-xs text-slate-400">
                  Kesalahan
                </div>
              </div>

              <div>
                <div className="font-mono text-lg font-bold text-amber-400">
                  {formatTime(shownTime)}
                </div>
                <div className="text-xs text-slate-400">
                  Waktu
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* AREA MENGETIK */}
        <TypingArea
          lang={lang}
          words={words}
          wordIndex={wordIndex}
          current={current}
          records={records}
          focused={focused}
          status={status}
          elapsed={elapsed}
          duration={duration}
          onType={handleTyping}
          onReset={() => resetTest()}
          onFocusChange={setFocused}
        />

        {/* GRAFIK DAN RIWAYAT */}
        <div className="grid gap-4 lg:grid-cols-12 lg:items-start">

          <div className="lg:col-span-8">
            <ChartPanel
              title={
                status === "running"
                  ? "Grafik tes berjalan"
                  : displayResult
                    ? `Grafik riwayat · ${displayResult.date}`
                    : "Grafik tes"
              }
              samples={displaySamples}
              marks={displayMarks}
              duration={displayDuration}
              result={displayResult}
            />
          </div>

          <div className="lg:col-span-4">
            <HistoryPanel
              history={history}
              selectedId={selectedId}
              best={best}
              onSelect={selectHistory}
              onClear={clearHistory}
            />
          </div>

        </div>

        {/* FOOTER */}
        <p className="px-1 text-center text-xs text-slate-500">
          {langLabel.flag} {langLabel.name} · Riwayat dan grafik tersimpan otomatis di browser ini.
        </p>

      </div>
    </main>
  );
}
