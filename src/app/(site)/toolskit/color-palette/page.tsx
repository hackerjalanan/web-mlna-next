"use client";

import { useState } from "react";
import { FaCopy, FaRotate } from "react-icons/fa6";

const randomColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
};

export default function ColorPalettePage() {
  const generatePalette = () =>
    Array.from({ length: 5 }, () => randomColor());

  const [colors, setColors] = useState(generatePalette());

  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    setColors(generatePalette());
    setCopied(null);
  };

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);

    setCopied(color);

    setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  const cssCode = colors
    .map(
      (color, index) =>
        `--color-${index + 1}: ${color};`
    )
    .join("\n");

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">
          Color Palette Generator
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Generate kombinasi warna secara otomatis
          untuk desain, website, dan branding.
        </p>
      </div>


      {/* Palette */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">

        {colors.map((color) => (

          <div
            key={color}
            className="
              group
              overflow-hidden
              rounded-sm
              border
              border-white/10
              bg-slate-900
            "
          >

            <div
              className="h-40"
              style={{
                backgroundColor: color,
              }}
            />


            <button
              onClick={() => copyColor(color)}
              className="
                flex
                w-full
                items-center
                justify-between
                px-3
                py-3
                text-sm
                text-white
                hover:bg-white/5
              "
            >

              <span>
                {copied === color
                  ? "Copied!"
                  : color}
              </span>

              <FaCopy
                className="
                  text-slate-400
                  group-hover:text-cyan-400
                "
              />

            </button>

          </div>

        ))}

      </div>


      {/* Action */}
      <button
        onClick={generate}
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-sm
          bg-cyan-400
          px-5
          py-3
          font-semibold
          text-slate-950
        "
      >
        <FaRotate />

        Generate Palette

      </button>



      {/* CSS Export */}

      <div
        className="
          rounded-sm
          border
          border-white/10
          bg-slate-950
          p-5
        "
      >

        <h2 className="mb-3 text-sm font-semibold text-white">
          CSS Variables
        </h2>


        <pre
          className="
            overflow-x-auto
            text-xs
            text-slate-300
          "
        >
    {`:root {
    ${cssCode}
    }`}
        </pre>


      </div>


    </div>
  );
}