"use client";

import { useState, useMemo, useCallback } from "react";
import { FaArrowRotateRight, FaRegCopy, FaCheck } from "react-icons/fa6";

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type OptionKey = keyof typeof CHAR_SETS;

const OPTIONS: { key: OptionKey; label: string }[] = [
  { key: "uppercase", label: "Huruf Besar (A-Z)" },
  { key: "lowercase", label: "Huruf Kecil (a-z)" },
  { key: "numbers", label: "Angka (0-9)" },
  { key: "symbols", label: "Simbol (!@#$%...)" },
];

function generatePassword(length: number, enabled: Record<OptionKey, boolean>) {
  const pool = OPTIONS.filter((opt) => enabled[opt.key])
    .map((opt) => CHAR_SETS[opt.key])
    .join("");

  if (!pool) return "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[randomValues[i] % pool.length];
  }
  return result;
}

function getStrength(length: number, enabled: Record<OptionKey, boolean>) {
  const activeSets = Object.values(enabled).filter(Boolean).length;

  if (length < 8 || activeSets <= 1) return { label: "Lemah", color: "bg-red-400", width: "w-1/3", text: "text-red-400" };
  if (length < 12 || activeSets <= 2) return { label: "Sedang", color: "bg-yellow-400", width: "w-2/3", text: "text-yellow-400" };
  return { label: "Kuat", color: "bg-cyan-400", width: "w-full", text: "text-cyan-400" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<Record<OptionKey, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() => generatePassword(16, {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  }));
  const [copied, setCopied] = useState(false);

  const noOptionSelected = !Object.values(enabled).some(Boolean);
  const strength = useMemo(() => getStrength(length, enabled), [length, enabled]);

  const handleGenerate = useCallback(() => {
    if (noOptionSelected) return;
    setPassword(generatePassword(length, enabled));
    setCopied(false);
  }, [length, enabled, noOptionSelected]);

  const toggleOption = (key: OptionKey) => {
    setEnabled((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // minimal satu opsi harus tetap aktif
      const stillHasOne = Object.values(next).some(Boolean);
      return stillHasOne ? next : prev;
    });
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* PASSWORD OUTPUT */}
      <div>
        <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-slate-950/60 p-3">
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-base text-white">
            {password || "—"}
          </code>

          <button
            onClick={handleGenerate}
            title="Generate ulang"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/10 text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400"
          >
            <FaArrowRotateRight size={14} />
          </button>

          <button
            onClick={handleCopy}
            title="Copy ke clipboard"
            disabled={!password}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-white/10 text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-cyan-400 disabled:opacity-40"
          >
            {copied ? <FaCheck size={14} className="text-cyan-400" /> : <FaRegCopy size={14} />}
          </button>
        </div>

        {/* STRENGTH BAR */}
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
            </div>
            <span className={`text-xs font-medium ${strength.text}`}>{strength.label}</span>
          </div>
        )}
      </div>

      {/* LENGTH SLIDER */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm text-slate-300">Panjang Password</label>
          <span className="text-sm font-semibold text-cyan-400">{length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>6</span>
          <span>32</span>
        </div>
      </div>

      {/* CHARACTER OPTIONS */}
      <div>
        <label className="mb-2 block text-sm text-slate-300">Karakter yang Digunakan</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-white/10 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-300 transition-colors hover:border-cyan-400/20"
            >
              <input
                type="checkbox"
                checked={enabled[opt.key]}
                onChange={() => toggleOption(opt.key)}
                className="h-4 w-4 accent-cyan-400"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {noOptionSelected && (
          <p className="mt-2 text-xs text-red-400">Pilih minimal satu jenis karakter.</p>
        )}
      </div>

      {/* GENERATE BUTTON */}
      <button
        onClick={handleGenerate}
        disabled={noOptionSelected}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaArrowRotateRight size={14} />
        Generate Password
      </button>
    </div>
  );
}