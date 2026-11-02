
"use client";

import { useState } from "react";

export default function Page() {
  // INPUT STATES
  const [workingHours, setWorkingHours] = useState("0");
  const [workingMinutes, setWorkingMinutes] = useState("0");
  const [workingSeconds, setWorkingSeconds] = useState("0");

  const [productivity, setProductivity] = useState("0");
  const [totalTap, setTotalTap] = useState("1");

  // INPUT VALUES
  const hours = Math.max(0, Number(workingHours) || 0);
  const minutes = Math.max(0, Number(workingMinutes) || 0);
  const seconds = Math.max(0, Number(workingSeconds) || 0);

  const totalProd = Math.max(0, Number(productivity) || 0);
  const tap = Math.max(0, Number(totalTap) || 0);

  // TOTAL TIME IN SECONDS
  const totalSeconds =
    hours * 3600 + minutes * 60 + seconds;

  // TOTAL TIME IN MINUTES
  const totalMinutes = totalSeconds / 60;

  // TOTAL TIME IN HOURS
  const totalHours = totalSeconds / 3600;

  // TOTAL HANDLE SESSIONS
  const totalHandle =
    tap > 0 ? totalProd / tap : 0;

  // PRODUCTIVITY PER HOUR
  const prodPerHour =
    totalHours > 0 ? totalProd / totalHours : 0;

  // AHT PER HANDLE SESSION
  const ahtMinutes =
    totalHandle > 0
      ? totalMinutes / totalHandle
      : 0;

  // FORMAT AHT
  const formatAHT = (value: number) => {
    const total = Math.round(value * 60);
    const mins = Math.floor(total / 60);
    const secs = total % 60;

    return `${mins}m ${String(secs).padStart(2, "0")}s`;
  };

  // FORMAT WORKING TIME
  const formatWorkingTime = () => {
    return `${hours} Jam ${minutes} Menit ${seconds} Detik`;
  };

  // RESET
  const resetCalculator = () => {
    setWorkingHours("0");
    setWorkingMinutes("0");
    setWorkingSeconds("0");
    setProductivity("0");
    setTotalTap("1");
  };

  return (
    <main className="min-h-dvh w-full bg-[#080D18] text-white flex items-center justify-center p-2 sm:p-3 lg:p-4">

      <div className="w-full max-w-[1100px] mx-auto">

        {/* HEADER */}
        <header className="text-center mb-3 sm:mb-4">

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[9px] font-bold tracking-widest mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            PERFORMANCE MONITORING
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Productivity <span className="text-blue-400">& AHT</span>
          </h1>

          <p className="text-gray-500 text-[10px] sm:text-xs mt-1">
            Productivity per Hour & Average Handle Time Calculator
          </p>

        </header>

        {/* DASHBOARD */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-2xl">

          {/* TOP SECTION */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">

            {/* WORKING HOURS */}
            <div className="bg-[#172033] border border-blue-500/20 rounded-xl p-2.5 sm:p-3">

              <label className="block text-blue-400 text-[9px] sm:text-[10px] font-bold tracking-wide mb-2">
                WORKING HOURS
              </label>

              <div className="grid grid-cols-3 gap-1.5">

                {/* JAM */}
                <div>
                  <input
                    type="number"
                    min="0"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full min-w-0 bg-[#0B1220] border border-blue-500/20 rounded-lg px-1 py-2 text-center text-lg font-bold text-blue-400 outline-none focus:border-blue-400 transition"
                  />

                  <p className="text-center text-gray-500 text-[9px] mt-1">
                    Jam
                  </p>
                </div>

                {/* MENIT */}
                <div>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={workingMinutes}
                    onChange={(e) => setWorkingMinutes(e.target.value)}
                    className="w-full min-w-0 bg-[#0B1220] border border-blue-500/20 rounded-lg px-1 py-2 text-center text-lg font-bold text-blue-400 outline-none focus:border-blue-400 transition"
                  />

                  <p className="text-center text-gray-500 text-[9px] mt-1">
                    Menit
                  </p>
                </div>

                {/* DETIK */}
                <div>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={workingSeconds}
                    onChange={(e) => setWorkingSeconds(e.target.value)}
                    className="w-full min-w-0 bg-[#0B1220] border border-blue-500/20 rounded-lg px-1 py-2 text-center text-lg font-bold text-blue-400 outline-none focus:border-blue-400 transition"
                  />

                  <p className="text-center text-gray-500 text-[9px] mt-1">
                    Detik
                  </p>
                </div>

              </div>

              <div className="mt-2 bg-blue-500/5 border border-blue-500/10 rounded-lg p-2">

                <p className="text-gray-500 text-[8px] font-semibold mb-1">
                  TOTAL WORKING TIME
                </p>

                <p className="text-blue-300 text-[10px] sm:text-xs font-bold leading-relaxed">
                  {formatWorkingTime()}
                </p>

              </div>

            </div>

            {/* PRODUCTIVITY INPUT */}
            <div className="bg-[#17251F] border border-green-500/20 rounded-xl p-2.5 sm:p-3">

              <label className="block text-green-400 text-[9px] sm:text-[10px] font-bold tracking-wide mb-2">
                TOTAL PRODUCTIVITY
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={productivity}
                onChange={(e) => setProductivity(e.target.value)}
                className="w-full min-w-0 bg-[#0B1712] border border-green-500/20 rounded-lg px-2.5 py-2 text-lg sm:text-xl font-bold text-green-400 outline-none focus:border-green-400 transition"
              />

              <p className="text-gray-500 text-[9px] mt-1.5">
                Total Cases
              </p>

            </div>

            {/* TOTAL TAP */}
            <div className="bg-[#25203C] border border-purple-500/20 rounded-xl p-2.5 sm:p-3">

              <label className="block text-purple-400 text-[9px] sm:text-[10px] font-bold tracking-wide mb-2">
                JUMLAH TAP
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={totalTap}
                onChange={(e) => setTotalTap(e.target.value)}
                className="w-full min-w-0 bg-[#160F27] border border-purple-500/20 rounded-lg px-2.5 py-2 text-lg sm:text-xl font-bold text-purple-400 outline-none focus:border-purple-400 transition"
              />

              <p className="text-gray-500 text-[9px] mt-1.5">
                {totalHandle.toFixed(2)} Handle Sessions
              </p>

            </div>

            {/* PRODUCTIVITY RESULT */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#142C27] to-[#111827] border border-green-500/20 rounded-xl p-2.5 sm:p-3">

              <div className="absolute -right-5 -top-5 w-16 h-16 rounded-full bg-green-500/10 blur-xl" />

              <div className="relative">

                <p className="text-green-400 text-[9px] font-bold tracking-wide">
                  PRODUCTIVITY / HOUR
                </p>

                <div className="mt-3">
                  <span className="text-3xl sm:text-4xl font-black tabular-nums">
                    {prodPerHour.toFixed(2)}
                  </span>
                </div>

                <p className="text-gray-400 text-[9px] mt-1">
                  Cases per hour
                </p>

              </div>

            </div>

            {/* AHT RESULT */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#25203C] to-[#111827] border border-purple-500/20 rounded-xl p-2.5 sm:p-3">

              <div className="absolute -right-5 -top-5 w-16 h-16 rounded-full bg-purple-500/10 blur-xl" />

              <div className="relative">

                <p className="text-purple-400 text-[9px] font-bold tracking-wide">
                  AHT / HANDLE TIME
                </p>

                <div className="mt-3 flex items-baseline gap-1">

                  <span className="text-3xl sm:text-4xl font-black tabular-nums">
                    {ahtMinutes.toFixed(2)}
                  </span>

                  <span className="text-gray-400 text-[10px]">
                    min
                  </span>

                </div>

                <p className="text-purple-300 text-[9px] mt-1">
                  {formatAHT(ahtMinutes)} / session
                </p>

              </div>

            </div>

          </div>

          {/* SUMMARY */}
          <div className="mt-2 sm:mt-3 bg-[#0B1220] rounded-xl border border-white/5 px-3 py-3">

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">

              {/* HOURS */}
              <div>
                <p className="text-gray-500 text-[8px] sm:text-[9px]">
                  TOTAL WORKING TIME
                </p>

                <p className="text-xs sm:text-sm font-bold text-blue-400 tabular-nums mt-1">
                  {formatWorkingTime()}
                </p>
              </div>

              {/* MINUTES */}
              <div className="sm:border-l sm:border-white/10 sm:pl-3">
                <p className="text-gray-500 text-[8px] sm:text-[9px]">
                  TOTAL MINUTES
                </p>

                <p className="text-sm sm:text-base font-bold text-purple-400 tabular-nums mt-1">
                  {totalMinutes.toFixed(2)}
                </p>
              </div>

              {/* CASES */}
              <div className="sm:border-l sm:border-white/10 sm:pl-3">
                <p className="text-gray-500 text-[8px] sm:text-[9px]">
                  TOTAL CASES
                </p>

                <p className="text-sm sm:text-base font-bold text-green-400 tabular-nums mt-1">
                  {totalProd}
                </p>
              </div>

              {/* HANDLE SESSIONS */}
              <div className="sm:border-l sm:border-white/10 sm:pl-3">
                <p className="text-gray-500 text-[8px] sm:text-[9px]">
                  HANDLE SESSIONS
                </p>

                <p className="text-sm sm:text-base font-bold text-purple-400 tabular-nums mt-1">
                  {totalHandle.toFixed(2)}
                </p>
              </div>

            </div>

          </div>

          {/* FORMULA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">

            <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-2">
              <p className="text-green-400 text-[9px] font-bold mb-1">
                PRODUCTIVITY
              </p>

              <p className="text-gray-400 text-[9px] sm:text-[10px]">
                Total Cases ÷ Total Hours
              </p>
            </div>

            <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-2">
              <p className="text-purple-400 text-[9px] font-bold mb-1">
                HANDLE SESSIONS
              </p>

              <p className="text-gray-400 text-[9px] sm:text-[10px]">
                Total Cases ÷ Total Tap
              </p>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-2">
              <p className="text-blue-400 text-[9px] font-bold mb-1">
                AHT
              </p>

              <p className="text-gray-400 text-[9px] sm:text-[10px]">
                Total Minutes ÷ Handle Sessions
              </p>
            </div>

          </div>

          {/* RESET */}
          <button
            onClick={resetCalculator}
            className="w-full mt-3 py-2.5 rounded-lg border border-white/10 text-gray-400 text-[11px] font-semibold hover:bg-white/5 hover:text-white transition active:scale-[0.98]"
          >
            ↻ Reset Calculator
          </button>

        </div>

        {/* FOOTER */}
        <footer className="text-center mt-2">
          <p className="text-gray-600 text-[8px]">
            © {new Date().getFullYear()} Productivity Calculator
          </p>
        </footer>

      </div>
    </main>
  );
}
