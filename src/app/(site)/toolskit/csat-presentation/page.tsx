
"use client";

import { useState } from "react";

export default function Page() {
  const [good, setGood] = useState("0");
  const [bad, setBad] = useState("0");

  const goodValue = Math.max(0, Number(good) || 0);
  const badValue = Math.max(0, Number(bad) || 0);
  const total = goodValue + badValue;

  const percentage =
    total > 0 ? (goodValue / total) * 100 : 0;

  const badPercentage =
    total > 0 ? (badValue / total) * 100 : 0;

  const needleAngle = -90 + percentage * 1.8;

  const status =
    total === 0
      ? {
          label: "WAITING FOR DATA",
          color: "text-gray-400 bg-gray-500/10 border-gray-500/20",
        }
      : percentage >= 80
      ? {
          label: "EXCELLENT PERFORMANCE",
          color: "text-green-400 bg-green-500/10 border-green-500/20",
        }
      : percentage >= 50
      ? {
          label: "NEEDS IMPROVEMENT",
          color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        }
      : {
          label: "LOW PERFORMANCE",
          color: "text-red-400 bg-red-500/10 border-red-500/20",
        };

  return (
    <main className="min-h-dvh w-full  text-white flex items-center justify-center px-3 py-3 sm:px-5 sm:py-4 overflow-x-hidden">

      <div className="w-full max-w-[850px] mx-auto">

        {/* HEADER */}
        <header className="text-center mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full  bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-semibold tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            CSAT MONITORING SYSTEM
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CSAT <span className="text-blue-400">Calculator</span>
          </h1>

          <p className="text-gray-500 text-xs mt-1">
            Monitor your Good & Bad Customer Satisfaction
          </p>
        </header>

        {/* MAIN CARD */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 md:items-center">

            {/* LEFT: GAUGE */}
            <section className="flex flex-col items-center justify-center">

              <p className="text-gray-400 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                Good CSAT Percentage
              </p>

              {/* SPEEDOMETER */}
              <div className="w-full max-w-[290px] mx-auto">
                <svg
                  viewBox="0 0 300 175"
                  className="w-full block"
                >
                  <defs>
                    <linearGradient
                      id="csatGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#FACC15" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>

                  {/* Background */}
                  <path
                    d="M 30 150 A 120 120 0 0 1 270 150"
                    fill="none"
                    stroke="#273244"
                    strokeWidth="17"
                    strokeLinecap="round"
                  />

                  {/* Gradient */}
                  <path
                    d="M 30 150 A 120 120 0 0 1 270 150"
                    fill="none"
                    stroke="url(#csatGradient)"
                    strokeWidth="17"
                    strokeLinecap="round"
                  />

                  {/* Needle */}
                  <g
                    style={{
                      transform: `rotate(${needleAngle}deg)`,
                      transformOrigin: "150px 150px",
                      transition:
                        "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <line
                      x1="150"
                      y1="150"
                      x2="150"
                      y2="43"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="150"
                      cy="43"
                      r="6"
                      fill="white"
                    />
                  </g>

                  {/* Center */}
                  <circle
                    cx="150"
                    cy="150"
                    r="11"
                    fill="white"
                  />

                  <circle
                    cx="150"
                    cy="150"
                    r="5"
                    fill="#3B82F6"
                  />

                  {/* Labels */}
                  <text
                    x="23"
                    y="174"
                    fill="#EF4444"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    0%
                  </text>

                  <text
                    x="150"
                    y="18"
                    textAnchor="middle"
                    fill="#FACC15"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    50%
                  </text>

                  <text
                    x="277"
                    y="174"
                    textAnchor="end"
                    fill="#22C55E"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    100%
                  </text>
                </svg>
              </div>

              {/* PERCENTAGE */}
              <div className="text-center -mt-1">
                <div className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums leading-none">
                  {percentage.toFixed(2)}
                  <span className="text-2xl text-blue-400 ml-1">%</span>
                </div>

                <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">
                  Current Performance
                </p>
              </div>

              {/* STATUS */}
              <div className={`mt-3 px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-wider ${status.color}`}>
                {status.label}
              </div>

            </section>

            {/* RIGHT: INPUT & SUMMARY */}
            <section className="flex flex-col gap-3">

              {/* INPUT */}
              <div className="grid grid-cols-2 gap-3">

                {/* GOOD */}
                <div className="bg-[#17251F] border border-green-500/20 rounded-xl p-3">
                  <label className="block text-green-400 text-xs font-bold mb-2">
                    GOOD CSAT
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={good}
                    onChange={(e) => setGood(e.target.value)}
                    className="w-full min-w-0 bg-[#0B1712] border border-green-500/20 rounded-lg p-2.5 text-xl sm:text-2xl font-bold text-green-400 outline-none focus:border-green-400 transition"
                  />

                  <p className="text-gray-500 text-[10px] mt-2">
                    {percentage.toFixed(2)}% of total
                  </p>
                </div>

                {/* BAD */}
                <div className="bg-[#291A20] border border-red-500/20 rounded-xl p-3">
                  <label className="block text-red-400 text-xs font-bold mb-2">
                    BAD CSAT
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={bad}
                    onChange={(e) => setBad(e.target.value)}
                    className="w-full min-w-0 bg-[#1B1016] border border-red-500/20 rounded-lg p-2.5 text-xl sm:text-2xl font-bold text-red-400 outline-none focus:border-red-400 transition"
                  />

                  <p className="text-gray-500 text-[10px] mt-2">
                    {badPercentage.toFixed(2)}% of total
                  </p>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="bg-[#0B1220] rounded-xl border border-white/5 p-3 sm:p-4">

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-xs">
                    Total Response
                  </span>

                  <span className="text-lg font-bold tabular-nums">
                    {total}
                  </span>
                </div>

                {/* PROGRESS */}
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-500 transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />

                  <div  
                    className="bg-red-500 transition-all duration-700"
                    style={{ width: `${badPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between mt-3 text-[10px] sm:text-xs">
                  <span className="text-green-400">
                    ● Good: {goodValue}
                  </span>

                  <span className="text-red-400">
                    ● Bad: {badValue}
                  </span>
                </div>
              </div>

              {/* RESET */}
              <button
                onClick={() => {
                  setGood("0");
                  setBad("0");
                }}
                className="w-full py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs font-semibold hover:bg-white/5 hover:text-white transition active:scale-[0.98]"
              >
                ↻ Reset Calculator
              </button>

              {/* FORMULA INFO */}
              <div className="text-center text-[10px] text-gray-600">
                Good CSAT = Good ÷ Total Response × 100%
              </div>

            </section>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center mt-3">
          <p className="text-gray-600 text-[10px]">
            © {new Date().getFullYear()} CSAT Calculator
          </p>
        </footer>

      </div>
    </main>
  );
}
