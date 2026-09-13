"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-white/50 hover:text-white transition-colors mb-2"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold">Resume</h1>
          </div>

          <div className="flex gap-2">
            {!isMobile && (
              <button
                onClick={() => {
                  const iframe = document.getElementById(
                    "resume-iframe"
                  ) as HTMLIFrameElement | null;
                  iframe?.contentWindow?.print();
                }}
                className="px-4 py-2 text-sm rounded-lg bg-[#A855F7] hover:bg-[#9333EA] transition-colors"
              >
                Cetak
              </button>
            )}
            <a
              href="/api/v1/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm rounded-lg border border-white/15 hover:bg-white/5 transition-colors"
            >
              Buka Tab Baru
            </a>
          </div>
        </div>

        {isMobile ? (
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-8 text-center">
            <p className="text-white/70 mb-4">
              Preview PDF tidak didukung di browser mobile.
            </p>
            <a
              href="/api/v1/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] transition-colors text-sm"
            >
              Buka / Unduh Resume
            </a>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d0d]">
            <iframe
              id="resume-iframe"
              src="/api/v1/resume"
              className="w-full h-[75vh] md:h-[85vh] bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}