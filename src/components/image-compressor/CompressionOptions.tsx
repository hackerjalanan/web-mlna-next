'use client';

import { FORMAT_OPTIONS } from './constants';

export default function CompressionOptions({
  quality,
  setQuality,

  maxWidth,
  setMaxWidth,

  originalWidth,

  format,
  setFormat,
}: any) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-slate-300">Quality</label>

          <span className="text-cyan-400">{Math.round(quality * 100)}%</span>
        </div>

        <input
          type="range"

          min={0.1}

          max={1}

          step={0.05}

          value={quality}

          onChange={(e) => setQuality(Number(e.target.value))}

          className="w-full accent-cyan-400"
        />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm text-slate-300">Max Width</label>

          <span className="text-cyan-400">{maxWidth}px</span>
        </div>

        <input
          type="range"

          min={320}

          max={originalWidth || 4000}

          step={10}

          value={maxWidth}

          onChange={(e) => setMaxWidth(Number(e.target.value))}

          className="w-full accent-cyan-400"
        />
      </div>

      <div>
        <label className="text-sm text-slate-300">Format</label>

        <div className="flex gap-2 mt-2">
          {FORMAT_OPTIONS.map((item) => (
            <button
              key={item.value}

              onClick={() => setFormat(item.value)}

              className={`
flex-1 rounded-sm border px-3 py-2 text-sm

${
  format === item.value
    ? 'border-cyan-400 text-cyan-400'
    : 'border-white/10 text-slate-400'
}

`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
