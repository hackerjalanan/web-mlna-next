"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrImage(dataUrl);
    } catch (err) {
      console.error("Gagal generate QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="mx-auto max-w-sm space-y-4 p-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Masukkan teks atau link..."
        className="w-full rounded border px-4 py-2"
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        className="w-full rounded bg-cyan-500 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate QR Code"}
      </button>

      {qrImage && (
        <div className="space-y-3 text-center">
          <img src={qrImage} alt="QR Code" className="mx-auto rounded border" />
          <button
            onClick={handleDownload}
            className="w-full rounded bg-slate-800 py-2 font-semibold text-white"
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}